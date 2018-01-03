package com.vizuri.fhir;

import static org.junit.Assert.*;

import java.util.List;

import org.hl7.fhir.dstu3.model.Slot;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.vizuri.fhir.repository.SlotRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureDataMongo
@ContextConfiguration(classes = {FhirConfig.class})
public class FhirSlotServiceApplicationJUnitTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirSlotServiceApplicationJUnitTests.class);
	
	@Autowired
	SlotRepository repository;
	
	
	@Before
	public void init(){
		
		repository.deleteAll();
		
		Slot slot1 = new Slot();
		slot1.setId("123");

		repository.save(slot1);
		logger.info("Init Complete");
	}
	
	
	@Test
	public void testFindById() {
		Slot response = repository.findOne("123");

		logger.info(">>>> FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindAll() {
		List<Slot> response = repository.findAll();
		for (Slot slot : response) {
			logger.info(">>>>> Found:" + slot.getId());
		}
        assertTrue(response.size() > 0);
	}
	@Test
	public void testCreate() {
		String id = "12345";
		
		Slot slot1 = new Slot();
		slot1.setId(id);
		repository.save(slot1);
		
		Slot response = repository.findOne(id);

		logger.info(">>>> Create FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testWrongIdFindById() {
		Slot response = repository.findOne("Wrong");
		logger.info(">>>> Wrong Id FindById");
		assertNull(response);
	}
	@Test 
	public void testDelete() {
		repository.delete("123");
		
		Slot response = repository.findOne("123");
		logger.info(">>>> Delete 123");
		assertNull(response);
	}
	

}
