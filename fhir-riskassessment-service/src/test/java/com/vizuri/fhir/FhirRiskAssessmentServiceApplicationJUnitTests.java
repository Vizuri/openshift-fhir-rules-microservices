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

import org.hl7.fhir.dstu3.model.RiskAssessment;
import org.hl7.fhir.dstu3.model.Questionnaire;
import org.hl7.fhir.dstu3.model.Reference;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.vizuri.fhir.repository.RiskAssessmentRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureDataMongo
@ContextConfiguration(classes = {FhirConfig.class, TestConfig.class})
public class FhirRiskAssessmentServiceApplicationJUnitTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirRiskAssessmentServiceApplicationJUnitTests.class);
	
	@Autowired
	RiskAssessmentRepository riskAssessmentRepository;
	

	
	@Before
	public void init(){
		
		riskAssessmentRepository.deleteAll();
		
		RiskAssessment riskAssessment1 = new RiskAssessment();
		riskAssessment1.setId("123");
		Reference ref1 = new Reference("Eudy");
		riskAssessment1.setSubject(ref1);
		riskAssessmentRepository.save(riskAssessment1);
		logger.info("Init Complete");
	}
	
	
	@Test
	public void testFindById() {
		RiskAssessment response = riskAssessmentRepository.findOne("123");

		logger.info(">>>> FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindAll() {
		List<RiskAssessment> response = riskAssessmentRepository.findAll();
		for (RiskAssessment riskAssessment : response) {
			logger.info(">>>>> Found:" + riskAssessment.getId());
		}
        assertTrue(response.size() > 0);
	}
	@Test
	public void testCreate() {
		String id = "12345";
		
		RiskAssessment riskAssessment1 = new RiskAssessment();
		riskAssessment1.setId(id);
		Reference ref1 = new Reference("111");
		riskAssessment1.setSubject(ref1);
		riskAssessmentRepository.save(riskAssessment1);
		
		RiskAssessment response = riskAssessmentRepository.findOne(id);

		logger.info(">>>> Create FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindBySubjectReference() {
		List<RiskAssessment> response = riskAssessmentRepository.findBySubjectReference("Eudy");
		for (RiskAssessment riskAssessment : response) {
			logger.info(">>>>> Found BySubjectReference:" + riskAssessment.getSubject().getReference());
		}
		assertTrue(response.size() > 0);
	}
	@Test
	public void testWrongIdFindById() {
		RiskAssessment response = riskAssessmentRepository.findOne("Wrong");
		logger.info(">>>> Wrong Id FindById");
		assertNull(response);
	}
	@Test 
	public void testDelete() {
		riskAssessmentRepository.delete("123");
		
		RiskAssessment response = riskAssessmentRepository.findOne("123");
		logger.info(">>>> Delete 123");
		assertNull(response);
	}
	

}

class TestConfig {
	@Bean @Autowired
	RestTemplateBuilder restTemplateBuilder() {
		return new RestTemplateBuilder();
	}
}
