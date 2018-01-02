package com.vizuri.fhir;


import static org.junit.Assert.assertTrue;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.util.List;

import org.hl7.fhir.dstu3.model.Patient;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;


import ca.uhn.fhir.context.FhirContext;
//import ca.uhn.fhir.model.dstu2.resource.Patient;
//import ca.uhn.fhir.model.dstu2.valueset.IdentifierUseEnum;
import ca.uhn.fhir.model.primitive.IdDt;
import ca.uhn.fhir.parser.DataFormatException;
import ca.uhn.fhir.parser.JsonParser;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations="classpath:application-test.properties")
public class FhirPatientServiceApplicationTests {
	private static Logger logger = LoggerFactory.getLogger(FhirPatientServiceApplicationTests.class);

	@Autowired
	private TestRestTemplate restTemplate;


	@Test
	public void testPatientService() {
		FhirContext ctx = FhirContext.forDstu3();
		InputStream is = getClass().getResourceAsStream("/examples-json/patient-example.json");
		Reader reader = new InputStreamReader(is);
		
		Patient patient = (Patient) ctx.newJsonParser().parseResource(reader);	
		String id = patient.getIdElement().getIdPart();

		
		logger.info(">>>> Sending Request:" + patient.getId() + ":" +  patient.getName());		

		ResponseEntity<Patient> retPatient = restTemplate.postForEntity("/patient", patient, Patient.class);
		logger.info(">>>> CreatePatient Response:" + retPatient.getStatusCodeValue());
		logger.info(">>>> Response Message:" + retPatient.getBody());
		assertTrue(retPatient.getStatusCodeValue() == 200);
		

		//ResponseEntity<List<Patient>> retPatients = restTemplate.getForObject("/patient", List.class);
		List<Patient> retPatients = restTemplate.getForObject("/patient", List.class);

		logger.info("Got Patients:" + retPatients.size());
		assertTrue(retPatients.size() == 1);

		
		Patient p3 = restTemplate.getForObject("/patient/" + id, Patient.class);
		logger.info("Got Patient:" + p3.getId());
		assertTrue(id.equals(p3.getIdElement().getIdPart()));
		

		restTemplate.delete("/patient/" + id);
		
		List<Patient> retPatients2 = restTemplate.getForObject("/patient", List.class);
		logger.info("Get Response Type:" + retPatients2.size());
		assertTrue(retPatients2.size() == 0);

	}	
	
}
