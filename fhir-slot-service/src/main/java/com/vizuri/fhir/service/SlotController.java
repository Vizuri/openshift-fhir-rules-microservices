package com.vizuri.fhir.service;


import org.hl7.fhir.dstu3.model.Slot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.vizuri.fhir.repository.SlotRepository;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/slot")
public class SlotController {
	private final SlotRepository repository;
	private static Logger logger = LoggerFactory.getLogger(SlotController.class);
	
	@Autowired
	public SlotController(SlotRepository repository){
		this.repository = repository;
	}
	//*************************
	@RequestMapping(method = RequestMethod.GET, produces = "application/json")
	public Iterable<?> findAll(@RequestParam (value="schedule",required = false)String schedule){
		if(schedule == null ){
			logger.info(">>>>>>>>>Find All Slot");
			return repository.findAll(); 
		}
		else{
			logger.info(">>>>>>>>>Find Slot:" + schedule);
			return repository.findByScheduleReference(schedule);
		}
	}	
	//***************************
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value="/{id}")
	public Slot findById(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>Find Slot:" + id);
		return repository.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
	public Slot create(@RequestBody Slot slot){
		logger.info(">>>>>>>>>> Creating Slot:" + slot.getId());
		return repository.save((Slot)slot);
	}
	@RequestMapping(method = RequestMethod.PUT, value="/{id}")
	  public Slot update(@PathVariable("id") String id, @RequestBody Slot slot) {
		Slot update = repository.findOne(id);
		update.setId(slot.getId());
	    update.setServiceCategory(slot.getServiceCategory());
	    update.setServiceType(slot.getServiceType());
	    update.setSpecialty(slot.getSpecialty());
	    update.setAppointmentType(slot.getAppointmentType());
	    update.setSchedule(slot.getSchedule());
	    update.setStatus(slot.getStatus());
	    update.setStart(slot.getStart());
	    update.setEnd(slot.getEnd());
	    update.setOverbooked(slot.getOverbooked());
	    update.setComment(slot.getComment());
	    logger.info(">>>>> Updating Slot:" + slot.getId());
	    return repository.save((Slot) update);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value="/{id}")
	public void delete(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>>Deleting Slot:" + id);
		repository.delete(id);
	}
}
