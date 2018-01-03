package com.vizuri.fhir.service;

import org.hl7.fhir.dstu3.model.FamilyMemberHistory;
import org.hl7.fhir.dstu3.model.codesystems.AdministrativeGender;
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

import com.vizuri.fhir.repository.FamilyMemberHistoryRepository;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/familymemberhistory")
public class FamilyMemberHistoryController {
	
	private final FamilyMemberHistoryRepository repository;
	private static Logger logger = LoggerFactory.getLogger(FamilyMemberHistoryController.class);
	
	@Autowired
	public FamilyMemberHistoryController(FamilyMemberHistoryRepository repository) {
		
		this.repository = repository;
	}
	
	@RequestMapping(method = RequestMethod.GET, produces = "application/json")
	public Iterable<?> findAll(@RequestParam (value="patient",required = false)String patient){
		if(patient == null ){
			logger.info(">>>>>>>>>Find All Family Member History");
			return repository.findAll(); 
		}
		else{
			logger.info(">>>>>>>>>Find Family Member History:" + patient);
			return repository.findByPatientReference(patient);
		}
	}	
	
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value="/{id}")
	public FamilyMemberHistory findById(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>Find Family Member History:" + id);
		return repository.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST, produces = "application/json", consumes="application/json")
	public FamilyMemberHistory create(@RequestBody FamilyMemberHistory familyMemberHistory) {
		
		logger.info(">>>>>> Creating Family Member History:" + familyMemberHistory.getId() + ":" + familyMemberHistory.getName());
		return repository.save((FamilyMemberHistory) familyMemberHistory);
	}
	@RequestMapping(method = RequestMethod.PUT, value="/{id}")
	  public FamilyMemberHistory update(@PathVariable("id") String id, @RequestBody FamilyMemberHistory familyMemberHistory) {
		FamilyMemberHistory update = repository.findOne(id);
	    update.setId(familyMemberHistory.getId());
	    update.setDate(familyMemberHistory.getDate());
	    update.setName(familyMemberHistory.getName());
	    update.setRelationship(familyMemberHistory.getRelationship());
	    update.setGender(familyMemberHistory.getGender());
	    update.setAge(familyMemberHistory.getAge());
	    update.setCondition(familyMemberHistory.getCondition());
	    logger.info(">>>>> Updating Family Member History:" + familyMemberHistory.getId());
	    return repository.save((FamilyMemberHistory) update);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value="/{id}")
	public void delete(@PathVariable("id") String id) {
		
		logger.info(">>>>> Deleting Family Member History:" + id);
		repository.delete(id);
	}
}
