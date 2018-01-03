package com.vizuri.fhir.service;

import org.hl7.fhir.dstu3.model.Questionnaire;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.vizuri.fhir.repository.QuestionnaireRepository;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/questionnaire")
public class QuestionnaireController {
	private final QuestionnaireRepository repository;
	private static Logger logger = LoggerFactory.getLogger(QuestionnaireController.class);
	
	@Autowired
	public QuestionnaireController(QuestionnaireRepository repository){
		this.repository = repository;
	}
	@RequestMapping(method = RequestMethod.GET, produces = "application/json")
	public Iterable<?>findAll(){
		logger.info(">>>>>>>>>Find All Questionnaire");
		return repository.findAll(); 
	}
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value="/{id}")
	public Questionnaire findById(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>Find Questionnaire:" + id);
		return repository.findOne(id);
	}
	@RequestMapping(method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
	public Questionnaire create(@RequestBody Questionnaire questionnaire){
		logger.info(">>>>>>>>>> Creating Questionnaire:" + questionnaire.getId());
		return repository.save((Questionnaire)questionnaire);
	}
	@RequestMapping(method = RequestMethod.DELETE, value="/{id}")
	public void delete(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>>Deleting Questionnaire:" + id);
		repository.delete(id);
	}
}
