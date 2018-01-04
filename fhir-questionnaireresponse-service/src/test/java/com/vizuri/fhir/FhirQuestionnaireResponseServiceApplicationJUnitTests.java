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

import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.hl7.fhir.dstu3.model.QuestionnaireResponse;
import org.hl7.fhir.dstu3.model.Reference;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.test.context.ContextConfiguration;

import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.vizuri.fhir.repository.QuestionnaireResponseRepository;

import ca.uhn.fhir.context.FhirContext;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureDataMongo
@ContextConfiguration(classes = {FhirConfig.class})
public class FhirQuestionnaireResponseServiceApplicationJUnitTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirQuestionnaireResponseServiceApplicationJUnitTests.class);
	
	@Autowired
	private QuestionnaireResponseRepository questionnaireResponseRepository;
	
	@Before
	public void init(){
		
		questionnaireResponseRepository.deleteAll();
		

		FhirContext ctx = FhirContext.forDstu3();
		QuestionnaireResponse questionnaireResponse1 = new QuestionnaireResponse();
		questionnaireResponse1.setId("123");
		Reference ref1 = new Reference("Eudy");
		Reference ref2 = new Reference("Questionnaire1");
		questionnaireResponse1.setSubject(ref1);
		questionnaireResponse1.setQuestionnaire(ref2);
		questionnaireResponseRepository.save(questionnaireResponse1);
		logger.info("Init Complete");
	}
	
	@Test
	public void test() {
		
	}
	
	@Test 
	public void testFindById() {
		QuestionnaireResponse response = questionnaireResponseRepository.findOne("123");

		logger.info(">>>> FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindAll() {
		List<QuestionnaireResponse> response = questionnaireResponseRepository.findAll();
		for (QuestionnaireResponse questionnaireResponse : response) {
			logger.info(">>>>> Found:" + questionnaireResponse.getId());
		}
        assertTrue(response.size() > 0);
	}
	@Test
	public void testCreate() {
		String id = "12345";
		
		QuestionnaireResponse questionnaireResponse1 = new QuestionnaireResponse();
		questionnaireResponse1.setId(id);
		Reference ref1 = new Reference("111");
		questionnaireResponse1.setSubject(ref1);
		questionnaireResponseRepository.save(questionnaireResponse1);
		
		QuestionnaireResponse response = questionnaireResponseRepository.findOne(id);

		logger.info(">>>> Create FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindBySubjectReference() {
		List<QuestionnaireResponse> response = questionnaireResponseRepository.findBySubjectReference("Eudy");
		for (QuestionnaireResponse questionnaireResponse : response) {
			logger.info(">>>>> Found BySubjectReference:" + questionnaireResponse.getSubject().getReference());
		}
		assertTrue(response.size() > 0);
	}
	@Test
	public void testFindByQuestionnaireReference() {
		List<QuestionnaireResponse> response = questionnaireResponseRepository.findByQuestionnaireReference("Questionnaire1");
		for (QuestionnaireResponse questionnaireResponse : response) {
			logger.info(">>>>> Found ByQuestionnaireReference:" + questionnaireResponse.getQuestionnaire().getReference());
		}
		assertTrue(response.size() > 0);
	}
	@Test
	public void testFindByQuestionnaireReferenceAndSubjectReference() {
		List<QuestionnaireResponse> response = questionnaireResponseRepository.findByQuestionnaireReferenceAndSubjectReference("Questionnaire1", "Eudy");
		for (QuestionnaireResponse questionnaireResponse : response){
			logger.info(">>>>> Found ByQuestionnaireReferenceAndSubjectReference:" +questionnaireResponse.getQuestionnaire().getReference()+ ", " +questionnaireResponse.getSubject().getReference());
		}
		assertTrue(response.size() > 0);
	}
	@Test 
	public void testDelete() {
		questionnaireResponseRepository.delete("123");
		
		QuestionnaireResponse response = questionnaireResponseRepository.findOne("123");
		logger.info(">>>> Delete 123");
		assertNull(response);
	}
	@Test
	public void testIdDoesNotExist() {
		QuestionnaireResponse response = questionnaireResponseRepository.findOne("wrong");
		logger.info(">>>> Test Id Does Not Exist");
		assertNull(response);
	}
	@Test 
	public void testOneBadStringsQuesionnaire(){
		List<QuestionnaireResponse> response = questionnaireResponseRepository.findByQuestionnaireReferenceAndSubjectReference("Wrong", "Eudy");
		logger.info(">>>>> Given One Bad String ByQuestionnaireReferenceAndSubjectReference");
		assertTrue(response.size() == 0);
	}
	@Test 
	public void testOneBadStringsSubject(){
		List<QuestionnaireResponse> response = questionnaireResponseRepository.findByQuestionnaireReferenceAndSubjectReference("Questionnaire1", "wrong");
		logger.info(">>>>> Given One Bad String ByQuestionnaireReferenceAndSubjectReference");
		assertTrue(response.size() == 0);
	}

}
