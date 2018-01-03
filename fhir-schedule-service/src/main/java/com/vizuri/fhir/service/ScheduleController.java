package com.vizuri.fhir.service;


import org.hl7.fhir.dstu3.model.Schedule;
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

import com.vizuri.fhir.repository.ScheduleRepository;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/schedule")
public class ScheduleController {
	private final ScheduleRepository repository;
	private static Logger logger = LoggerFactory.getLogger(ScheduleController.class);
	
	@Autowired
	public ScheduleController(ScheduleRepository repository){
		this.repository = repository;
	}
	//*************************
	@RequestMapping(method = RequestMethod.GET, produces = "application/json")
	public Iterable<?> findAll(@RequestParam (value="actor",required = false)String actor){
		if(actor == null ){
			logger.info(">>>>>>>>>Find All Schedule");
			return repository.findAll(); 
		}
		else{
			logger.info(">>>>>>>>>Find Schedule:" + actor);
			return repository.findByActorReference(actor);
		}
	}	
	//***************************
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value="/{id}")
	public Schedule findById(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>Find Schedule:" + id);
		return repository.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
	public Schedule create(@RequestBody Schedule schedule){
		logger.info(">>>>>>>>>> Creating Schedule:" + schedule.getId());
		return repository.save((Schedule)schedule);
	}
	@RequestMapping(method = RequestMethod.PUT, value="/{id}")
	  public Schedule update(@PathVariable("id") String id, @RequestBody Schedule schedule) {
		Schedule update = repository.findOne(id);
	    update.setId(schedule.getId());
	    update.setActive(schedule.getActive());
	    update.setServiceCategory(schedule.getServiceCategory());
	    update.setServiceType(schedule.getServiceType());
	    update.setSpecialty(schedule.getSpecialty());
	    update.setActor(schedule.getActor());
	    update.setPlanningHorizon(schedule.getPlanningHorizon());
	    update.setComment(schedule.getComment());
	    logger.info(">>>>> Updating Schedule:" + schedule.getId());
	    return repository.save((Schedule) update);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value="/{id}")
	public void delete(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>>Deleting Schedule:" + id);
		repository.delete(id);
	}
}
