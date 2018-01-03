package com.vizuri.fhir.service;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.QuestionnaireResponse;
import org.hl7.fhir.dstu3.model.RiskAssessment;
import org.hl7.fhir.dstu3.model.FamilyMemberHistory;
import org.kie.server.api.marshalling.MarshallingFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
//the org.kie   **need to add to the settings.xml 
import org.kie.api.KieServices;
import org.kie.api.command.Command;
import org.kie.api.command.KieCommands;
import org.kie.api.runtime.ExecutionResults;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.manager.RuntimeEngine;
import org.kie.api.runtime.rule.QueryResults;
import org.kie.api.runtime.rule.QueryResultsRow;
import org.kie.internal.command.CommandFactory;
import org.kie.server.api.marshalling.MarshallingFormat;
import org.kie.server.api.model.ServiceResponse;
import org.kie.server.api.model.ServiceResponse.ResponseType;
import org.kie.server.client.KieServicesClient;
import org.kie.server.client.KieServicesConfiguration;
import org.kie.server.client.KieServicesFactory;
import org.kie.server.client.RuleServicesClient;
//import org.openid4java.util.HttpResponse;
import org.kie.server.client.impl.KieServicesConfigurationImpl;
import org.apache.http.HttpResponse;

import com.vizuri.fhir.repository.RiskAssessmentRepository;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/riskAssessment")
public class RiskAssessmentController {
	private final RiskAssessmentRepository repository;
	
	private final RestTemplate restTemplate;
	
	private static Logger logger = LoggerFactory.getLogger(RiskAssessmentController.class);
	
	//Firing rules 
	@Value( "${fhir.framingham.service.url}")
	private String URL_FRAMINGHAM;
	@Value( "${fhir.heartdisease.service.url}")
	private String URL_HEARTDISEASE;
	@Value( "${fhir.diabetes.service.url}")
	private String URL_DIABETES;
	@Value( "${fhir.framingham.service.container_id}")
	private String CONTAINER_ID_FRAMINGHAM;
	@Value( "${fhir.heartdisease.service.container_id}")
	private String CONTAINER_ID_HEARTDISEASE;
	@Value( "${fhir.diabetes.service.container_id}")
	private String CONTAINER_ID_DIABETES;
	@Value( "${fhir.framingham.service.user}")
	private String USER;
	@Value( "${fhir.framingham.service.password}")
	private String PASSWORD;
	
	
	private static final MarshallingFormat FORMAT = MarshallingFormat.XSTREAM;
	
	@Value( "${fhir.patient.service.url}" )
	private String fhirPatientServiceUrl;
	@Value( "${fhir.observation.service.url}" )
	private String fhirObservationServiceUrl;
	@Value( "${fhir.questionnaireresponse.service.url}" )
	private String fhirQuestionnaireResponseServiceUrl;
	@Value( "${fhir.familymemberhistory.service.url}" )
	private String fhirFamilyMemberHistoryServiceUrl;

	
	@Autowired
	public RiskAssessmentController(RiskAssessmentRepository repository, RestTemplate restTemplat){
		this.repository = repository;
		this.restTemplate = restTemplat;
	}
	@RequestMapping(method = RequestMethod.GET, produces = "application/json")
	public Iterable<?>findAll(@RequestParam(value = "subject", required= false) String subject){
		if(subject == null){
			logger.info(">>>>>>>>>Find All RiskAssessment");
			return repository.findAll(); 
		}
		else{
			logger.info(">>>>>>>>>Find All RiskAssessment");
			return repository.findBySubjectReference(subject);
		}
	}
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value="/{id}")
	public RiskAssessment findById(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>Find RiskAssessment:" + id);
		return repository.findOne(id);
	}
	@RequestMapping(method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
	public RiskAssessment create(@RequestBody RiskAssessment riskAssessment){
		logger.info(">>>>>>>>>> Creating Observation:" + riskAssessment.getId());
		return repository.save((RiskAssessment)riskAssessment);
	}
	
	//fire all rules and post riskAssessment to database;
	@RequestMapping(path="/framingham/{id}", method = RequestMethod.POST, produces = "application/json")
	public RiskAssessment framingham(@PathVariable("id")String id){
		//get objects
		Patient patient = restTemplate.getForObject(fhirPatientServiceUrl + "/" + id, Patient.class);
		Observation observation = restTemplate.getForObject(fhirObservationServiceUrl + "/Observation_" + id, Observation.class);
		QuestionnaireResponse questionnaireResponse = restTemplate.getForObject(fhirQuestionnaireResponseServiceUrl + "/" + id + "_vizuri-fhir-questionnaire", QuestionnaireResponse.class);
		
		KieServicesConfiguration conf;
		KieServicesClient kieServicesClient;
		//set configurations
		conf = KieServicesFactory.newRestConfiguration(URL_FRAMINGHAM, USER, PASSWORD);
		conf.setMarshallingFormat(FORMAT);
			
		kieServicesClient = KieServicesFactory.newKieServicesClient(conf);
		RuleServicesClient rulesClient = kieServicesClient.getServicesClient(RuleServicesClient.class);
	
		kieServicesClient = KieServicesFactory.newKieServicesClient(conf);
					
		KieCommands commandsFactory = KieServices.Factory.get().getCommands();
			
		Command<?> insertPatient = commandsFactory.newInsert(patient);
		Command<?> insertQuestionnaireResponse = commandsFactory.newInsert(questionnaireResponse);
		Command<?> insertObservation = commandsFactory.newInsert(observation);
		Command<?> raQuery = commandsFactory.newQuery("raQuery", "getRiskAssessment");
		Command<?> fireAllRules = commandsFactory.newFireAllRules();
		Command<?> batchCommand = commandsFactory.newBatchExecution(Arrays.asList(insertPatient, insertQuestionnaireResponse, insertObservation, fireAllRules, raQuery), "Ksession");
			
		ServiceResponse<ExecutionResults> executeResponse = rulesClient.executeCommandsWithResults(CONTAINER_ID_FRAMINGHAM, batchCommand);
		if (executeResponse.getType() == ResponseType.SUCCESS) {
			System.out.println("Commands executed with success! Response: ");
	
			System.out.println(executeResponse.getResult());
			ExecutionResults results = executeResponse.getResult();
	
			QueryResults raQUery = (QueryResults) results.getValue("raQuery");
			System.out.println("raQuery size:" + raQUery.size());
			if (raQUery.size() > 0) {
				RiskAssessment ra = (RiskAssessment) raQUery.iterator().next().get("riskAssessment");
				System.out.println("RA:" + ra);
				FhirContext fhirContext = new FhirContext();
				IParser jsonParser = fhirContext.newJsonParser();
				String encoded = jsonParser.encodeResourceToString(ra);
				System.out.println("ResourceString:" + encoded);
				return repository.save((RiskAssessment)ra);
			}
		}
		RiskAssessment error = new RiskAssessment();
		error.setId("Framingham Rules Engine Failed");
		return repository.save((RiskAssessment)error);	
	}
	
	//fire all rules and post riskAssessment to database;
	@RequestMapping(path="/heartDisease/{id}", method = RequestMethod.POST, produces = "application/json")
	public RiskAssessment heartDisease(@PathVariable("id")String id){
		
		Patient patient = restTemplate.getForObject(fhirPatientServiceUrl + "/" + id, Patient.class);
		Observation observation = restTemplate.getForObject(fhirObservationServiceUrl + "/Observation_" + id, Observation.class);
		QuestionnaireResponse questionnaireResponse = restTemplate.getForObject(fhirQuestionnaireResponseServiceUrl + "/" + id + "_vizuri-fhir-questionnaire", QuestionnaireResponse.class);
		ArrayList<FamilyMemberHistory> familyMemberHistory = restTemplate.getForObject(fhirFamilyMemberHistoryServiceUrl + "?patient=" + id, ArrayList.class);
		
		KieServicesConfiguration conf;
		KieServicesClient kieServicesClient;
		
		//change the uri so that it fires the heart disease
		conf = KieServicesFactory.newRestConfiguration(URL_HEARTDISEASE, USER, PASSWORD);
		conf.setMarshallingFormat(FORMAT);
		
		kieServicesClient = KieServicesFactory.newKieServicesClient(conf);
		RuleServicesClient rulesClient = kieServicesClient.getServicesClient(RuleServicesClient.class);
		
		//make the batch command
		kieServicesClient = KieServicesFactory.newKieServicesClient(conf);
		
		KieCommands commandsFactory = KieServices.Factory.get().getCommands();
		
		List<Command<?>> commands = new ArrayList<Command<?>>();
		
		commands.add(commandsFactory.newInsert(patient));
		commands.add(commandsFactory.newInsert(questionnaireResponse));
		commands.add(commandsFactory.newInsert(observation));
		
		for(int i = 0; i < familyMemberHistory.size(); i++) {
			
			commands.add(commandsFactory.newInsert(familyMemberHistory.get(i)));
		}
		
		commands.add(commandsFactory.newFireAllRules());
		commands.add(commandsFactory.newQuery("raQuery", "getRiskAssessment"));
		
		Command<?> batchCommand = commandsFactory.newBatchExecution(commands, "Ksession");
		
		System.out.println(batchCommand);
		
		//firing the rules
		ServiceResponse<ExecutionResults> executeResponse = rulesClient.executeCommandsWithResults(CONTAINER_ID_HEARTDISEASE,
				batchCommand);
		
		if (executeResponse.getType() == ResponseType.SUCCESS) {
			System.out.println("Commands executed with success! Response: ");

			System.out.println(executeResponse.getResult());
			ExecutionResults results = executeResponse.getResult();
			
			QueryResults raQUery = (QueryResults) results.getValue("raQuery");
			System.out.println("raQuery size:" + raQUery.size());
			if (raQUery.size() > 0) {
				RiskAssessment ra = (RiskAssessment) raQUery.iterator().next().get("riskAssessment");
				System.out.println("RA:" + ra);
				FhirContext fhirContext = new FhirContext();
				IParser jsonParser = fhirContext.newJsonParser();
				String encoded = jsonParser.encodeResourceToString(ra);
				System.out.println("ResourceString:" + encoded);
				return repository.save((RiskAssessment)ra);
			
			} else {
				
				RiskAssessment error = new RiskAssessment();
				error.setId("A Heart Disease rule failed");
				return repository.save((RiskAssessment)error);
			}
		
		}
		//make an error statement
		RiskAssessment error = new RiskAssessment();
		error.setId("Heart Disease Rules engine failed");
		return repository.save((RiskAssessment)error);
	}
	
	@RequestMapping(path="/diabetes/{id}", method = RequestMethod.POST, produces = "application/json")
	public RiskAssessment diabetes(@PathVariable("id")String id){
		
		Patient patient = restTemplate.getForObject(fhirPatientServiceUrl + "/" + id, Patient.class);
		Observation observation = restTemplate.getForObject(fhirObservationServiceUrl + "/Observation_" + id, Observation.class);
		QuestionnaireResponse questionnaireResponse = restTemplate.getForObject(fhirQuestionnaireResponseServiceUrl + "/" + id + "_vizuri-fhir-questionnaire", QuestionnaireResponse.class);
		ArrayList<FamilyMemberHistory> familyMemberHistory = restTemplate.getForObject(fhirFamilyMemberHistoryServiceUrl + "?patient=" + id, ArrayList.class);
		
		KieServicesConfiguration conf;
		KieServicesClient kieServicesClient;
		
		//change the uri so that it fires the heart disease
		conf = KieServicesFactory.newRestConfiguration(URL_DIABETES, USER, PASSWORD);
		conf.setMarshallingFormat(FORMAT);
		
		kieServicesClient = KieServicesFactory.newKieServicesClient(conf);
		RuleServicesClient rulesClient = kieServicesClient.getServicesClient(RuleServicesClient.class);
		
		//make the batch command
		kieServicesClient = KieServicesFactory.newKieServicesClient(conf);
		
		KieCommands commandsFactory = KieServices.Factory.get().getCommands();
		
		List<Command<?>> commands = new ArrayList<Command<?>>();
		
		commands.add(commandsFactory.newInsert(patient));
		commands.add(commandsFactory.newInsert(questionnaireResponse));
		commands.add(commandsFactory.newInsert(observation));
		
		for(int i = 0; i < familyMemberHistory.size(); i++) {
			
			commands.add(commandsFactory.newInsert(familyMemberHistory.get(i)));
		}
		
		commands.add(commandsFactory.newFireAllRules());
		commands.add(commandsFactory.newQuery("raQuery", "getRiskAssessment"));
		
		Command<?> batchCommand = commandsFactory.newBatchExecution(commands, "Ksession");
		
		System.out.println(batchCommand);
		
		//firing the rules
		ServiceResponse<ExecutionResults> executeResponse = rulesClient.executeCommandsWithResults(CONTAINER_ID_DIABETES,
				batchCommand);
		
		if (executeResponse.getType() == ResponseType.SUCCESS) {
			System.out.println("Commands executed with success! Response: ");

			System.out.println(executeResponse.getResult());
			ExecutionResults results = executeResponse.getResult();
			
			QueryResults raQUery = (QueryResults) results.getValue("raQuery");
			System.out.println("raQuery size:" + raQUery.size());
			if (raQUery.size() > 0) {
				RiskAssessment ra = (RiskAssessment) raQUery.iterator().next().get("riskAssessment");
				System.out.println("RA:" + ra);
				FhirContext fhirContext = new FhirContext();
				IParser jsonParser = fhirContext.newJsonParser();
				String encoded = jsonParser.encodeResourceToString(ra);
				System.out.println("ResourceString:" + encoded);
				return repository.save((RiskAssessment)ra);
			
			} else {
				
				RiskAssessment error = new RiskAssessment();
				error.setId("A Diabetes rule failed");
				return repository.save((RiskAssessment)error);
			}
		
		}
		//make an error statement
		RiskAssessment error = new RiskAssessment();
		error.setId("Diabetes Rules engine failed");
		return repository.save((RiskAssessment)error);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value="/{id}")
	public void delete(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>>Deleting RiskAssessment:" + id);
		repository.delete(id);
	}
}
