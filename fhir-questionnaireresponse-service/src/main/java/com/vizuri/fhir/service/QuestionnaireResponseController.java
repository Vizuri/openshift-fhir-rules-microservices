package com.vizuri.fhir.service;

import org.hl7.fhir.dstu3.model.QuestionnaireResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vizuri.fhir.repository.QuestionnaireResponseRepository;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/questionnaireResponse")
public class QuestionnaireResponseController {
	private final QuestionnaireResponseRepository repository;
	private static Logger logger = LoggerFactory.getLogger(QuestionnaireResponseController.class);
	
	@Autowired
	public QuestionnaireResponseController(QuestionnaireResponseRepository repository){
		this.repository = repository;
	}
	

	
	@RequestMapping(method = RequestMethod.GET, produces = "application/json")
	public Iterable<?> findAll(@RequestParam (value="subject",required = false)String subject, @RequestParam(value="questionnaire",required =false)String questionnaire){
		if(subject == null && questionnaire == null){
			logger.info(">>>>>>>>>Find All Questionnaire Response");
			return repository.findAll(); 
		}
		else if(questionnaire == null){
			logger.info(">>>>>>>>>Find Questionnaire Response by:" + subject);
			return repository.findBySubjectReference(subject);
		}
		else if(subject == null){
			logger.info(">>>>>>>>>>>>Find Questionnaire Response by:" + questionnaire);
			return repository.findByQuestionnaireReference(questionnaire);
		}
		else {
			logger.info(">>>>>>>>>Find Questionnaire Response by:" + subject + questionnaire);
			return repository.findByQuestionnaireReferenceAndSubjectReference(questionnaire, subject);
		}
	}	
	
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value="/{id}")
	public QuestionnaireResponse findById(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>Find QuestionnaireResponse:" + id);
		return repository.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
	public QuestionnaireResponse create(@RequestBody QuestionnaireResponse questionnaireResponse){
		logger.info(">>>>>>>>>> Creating QuestionnaireResponse:" + questionnaireResponse.getId());
		return repository.save((QuestionnaireResponse)questionnaireResponse);
	}
	@RequestMapping(method = RequestMethod.PUT, value="/{id}")
	  public QuestionnaireResponse update(@PathVariable("id") String id, @RequestBody QuestionnaireResponse questionnaireResponse) {
		QuestionnaireResponse update = repository.findOne(id);
	    update.setId(questionnaireResponse.getId());
	    update.setItem(questionnaireResponse.getItem());
	    logger.info(">>>>> Updating Questionnaire Response:" + questionnaireResponse.getId());
	    return repository.save((QuestionnaireResponse) update);
	}
	@RequestMapping(method = RequestMethod.DELETE, value="/{id}")
	public void delete(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>>Deleting QuestionnaireResponse:" + id);
		repository.delete(id);
	}
}
