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

import org.hl7.fhir.dstu3.model.Patient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.vizuri.fhir.repository.PatientRepository;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/patient")
public class PatientController {
	private final PatientRepository repository;
	private static Logger logger = LoggerFactory.getLogger(PatientController.class);
	
	@Autowired
	public PatientController(PatientRepository repository) {
		this.repository = repository;
	}

	@RequestMapping(method = RequestMethod.GET, produces = "application/json")
	public Iterable<?> findAll() {
		logger.info(">>>>>> Find All Patients");
		return repository.findAll();
	}
	@RequestMapping(method = RequestMethod.GET, produces = "application/json", value="/{id}")
	public Patient findById(@PathVariable("id") String id) {
		logger.info(">>>>>> Find Patient:"  + id);
		return repository.findOne(id);
	}
	@RequestMapping(method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
	public Patient create(@RequestBody Patient patient) {
		logger.info(">>>>> Creating Patient:" + patient.getId() + ":" + patient.getName());
		return repository.save((Patient)patient);
	}
	@RequestMapping(method = RequestMethod.PUT, value="/{id}")
	  public Patient update(@PathVariable("id") String id, @RequestBody Patient patient) {
	    Patient update = repository.findOne(id);
	    update.setId(patient.getId());
	    update.setName(patient.getName());
	    update.setGender(patient.getGender());
	    update.setBirthDate(patient.getBirthDate());
	    logger.info(">>>>> Updating Patient:" + patient.getId() + ":" + patient.getName());
	    return repository.save((Patient) update);
	}
	@RequestMapping(method = RequestMethod.DELETE, value="/{id}")
	public void delete(@PathVariable("id") String id) {
		logger.info(">>>>> Deleting Patient:" + id);
		repository.delete(id);
	}
		
}
