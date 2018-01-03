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

package com.vizuri.fhir;

import static org.junit.Assert.*;

import java.util.List;

import org.hl7.fhir.dstu3.model.Questionnaire;
import org.hl7.fhir.dstu3.model.Enumerations.AdministrativeGender;
import org.hl7.fhir.dstu3.model.FamilyMemberHistory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.vizuri.fhir.repository.FamilyMemberHistoryRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureDataMongo
@ContextConfiguration(classes = {FhirConfig.class})
public class FhirFamilyMemberHistoryApplicationJUnitTest {
	
	private static Logger logger =LoggerFactory.getLogger(FhirFamilyMemberHistoryApplicationJUnitTest.class);
	
	@Autowired
	FamilyMemberHistoryRepository repository;
	
	
	@Before
	public void init(){
		
		repository.deleteAll();
		
		FamilyMemberHistory familyMemberHistory1 = new FamilyMemberHistory();
		familyMemberHistory1.setId("123");
		familyMemberHistory1.setName("Eric");

		repository.save(familyMemberHistory1);
		logger.info("Init Complete");
	}
	
	
	@Test
	public void testFindById() {
		FamilyMemberHistory response = repository.findOne("123");

		logger.info(">>>> FindById:" + response.getId());
		assertNotNull(response);
	}
	
	@Test
	public void testFindAll() {
		List<FamilyMemberHistory> response = repository.findAll();
		for (FamilyMemberHistory familyMemberHistory : response) {
			logger.info(">>>>> Found:" + familyMemberHistory.getId());
		}
        assertTrue(response.size() > 0);
	}
	@Test
	public void testCreate() {
		String id = "12345";
		
		FamilyMemberHistory familyMemberHistory1 = new FamilyMemberHistory();
		familyMemberHistory1.setId(id);
		repository.save(familyMemberHistory1);
		
		FamilyMemberHistory response = repository.findOne(id);

		logger.info(">>>> Create FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testWrongIdFindById() {
		FamilyMemberHistory response = repository.findOne("Wrong");
		logger.info(">>>> Wrong Id FindById");
		assertNull(response);
	}
	@Test 
	public void testDelete() {
		repository.delete("123");
		
		FamilyMemberHistory response = repository.findOne("123");
		logger.info(">>>> Delete 123");
		assertNull(response);
	}
	

}