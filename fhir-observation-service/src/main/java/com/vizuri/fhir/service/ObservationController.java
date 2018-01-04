/*
 * Copyright 2015 Vizuri, a business division of AEM Corporation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

package com.vizuri.fhir.service;


import org.hl7.fhir.dstu3.model.Observation;
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

import com.vizuri.fhir.repository.ObservationRepository;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/observation")
public class ObservationController {
	private final ObservationRepository repository;
	private static Logger logger = LoggerFactory.getLogger(ObservationController.class);
	
	@Autowired
	public ObservationController(ObservationRepository repository){
		this.repository = repository;
	}
	//*************************
	@RequestMapping(method = RequestMethod.GET, produces = "application/json")
	public Iterable<?> findAll(@RequestParam (value="subject",required = false)String subject){
		if(subject == null ){
			logger.info(">>>>>>>>>Find All Observation");
			return repository.findAll(); 
		}
		else{
			logger.info(">>>>>>>>>Find Observation:" + subject);
			return repository.findBySubjectReference(subject);
		}
	}	
	//***************************
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value="/{id}")
	public Observation findById(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>Find Observation:" + id);
		return repository.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
	public Observation create(@RequestBody Observation observation){
		logger.info(">>>>>>>>>> Creating Observation:" + observation.getId());
		return repository.save((Observation)observation);
	}
	@RequestMapping(method = RequestMethod.PUT, value="/{id}")
	  public Observation update(@PathVariable("id") String id, @RequestBody Observation observation) {
		Observation update = repository.findOne(id);
	    update.setId(observation.getId());
	    update.setIssued(observation.getIssued());
	    update.setComponent(observation.getComponent());
	    logger.info(">>>>> Updating Observation:" + observation.getId());
	    return repository.save((Observation) update);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value="/{id}")
	public void delete(@PathVariable("id")String id){
		logger.info(">>>>>>>>>>>Deleting Observation:" + id);
		repository.delete(id);
	}
}
