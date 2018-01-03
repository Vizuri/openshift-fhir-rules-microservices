package com.vizuri.fhir;

import static org.junit.Assert.*;

import java.util.List;

import org.hl7.fhir.dstu3.model.Questionnaire;
import org.hl7.fhir.dstu3.model.Schedule;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.vizuri.fhir.repository.ScheduleRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureDataMongo
@ContextConfiguration(classes = {FhirConfig.class})
public class FhirScheduleServiceApplicationJUnitTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirScheduleServiceApplicationJUnitTests.class);
	
	@Autowired
	ScheduleRepository repository;
	
	
	@Before
	public void init(){
		
		repository.deleteAll();
		
		Schedule schedule1 = new Schedule();
		schedule1.setId("123");

		repository.save(schedule1);
		logger.info("Init Complete");
	}
	
	
	@Test
	public void testFindById() {
		Schedule response = repository.findOne("123");

		logger.info(">>>> FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindAll() {
		List<Schedule> response = repository.findAll();
		for (Schedule schedule : response) {
			logger.info(">>>>> Found:" + schedule.getId());
		}
        assertTrue(response.size() > 0);
	}
	@Test
	public void testCreate() {
		String id = "12345";
		
		Schedule schedule1 = new Schedule();
		schedule1.setId(id);
		repository.save(schedule1);
		
		Schedule response = repository.findOne(id);

		logger.info(">>>> Create FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testWrongIdFindById() {
		Schedule response = repository.findOne("Wrong");
		logger.info(">>>> Wrong Id FindById");
		assertNull(response);
	}
	@Test 
	public void testDelete() {
		repository.delete("123");
		
		Schedule response = repository.findOne("123");
		logger.info(">>>> Delete 123");
		assertNull(response);
	}
	

}
