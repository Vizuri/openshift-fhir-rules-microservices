package com.vizuri.fhir;

import static org.junit.Assert.*;

import java.util.List;

import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Questionnaire;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.vizuri.fhir.repository.QuestionnaireRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureDataMongo
@ContextConfiguration(classes = {FhirConfig.class})
public class FhirQuestionnaireServiceApplicationJUnitTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirQuestionnaireServiceApplicationJUnitTests.class);
	
	@Autowired
	QuestionnaireRepository repository;
	
	
	@Before
	public void init(){
		
		repository.deleteAll();
		
		Questionnaire questionnaire1 = new Questionnaire();
		questionnaire1.setId("123");

		repository.save(questionnaire1);
		logger.info("Init Complete");
	}
	
	
	@Test
	public void testFindById() {
		Questionnaire response = repository.findOne("123");

		logger.info(">>>> FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindAll() {
		List<Questionnaire> response = repository.findAll();
		for (Questionnaire questionnaire : response) {
			logger.info(">>>>> Found:" + questionnaire.getId());
		}
        assertTrue(response.size() > 0);
	}
	@Test
	public void testCreate() {
		String id = "12345";
		
		Questionnaire questionnaire1 = new Questionnaire();
		questionnaire1.setId(id);
		repository.save(questionnaire1);
		
		Questionnaire response = repository.findOne(id);

		logger.info(">>>> Create FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testWrongIdFindById() {
		Questionnaire response = repository.findOne("Wrong");
		logger.info(">>>> Wrong Id FindById");
		assertNull(response);
	}
	@Test 
	public void testDelete() {
		repository.delete("123");
		
		Questionnaire response = repository.findOne("123");
		logger.info(">>>> Delete 123");
		assertNull(response);
	}
	

}
