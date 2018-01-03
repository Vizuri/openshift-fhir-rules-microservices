package com.vizuri.fhir;

import static org.junit.Assert.*;

import java.util.List;

import org.hl7.fhir.dstu3.model.Observation;
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

import com.vizuri.fhir.repository.ObservationRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureDataMongo
@ContextConfiguration(classes = {FhirConfig.class})
public class FhirObservationServiceApplicationJUnitTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirObservationServiceApplicationJUnitTests.class);
	
	@Autowired
	ObservationRepository observationRepository;
	
	
	@Before
	public void init(){
		
		observationRepository.deleteAll();
		
		Observation observation1 = new Observation();
		observation1.setId("123");
		Reference ref1 = new Reference("Eudy");
		
		observation1.setSubject(ref1);
		observationRepository.save(observation1);
		logger.info("Init Complete");
	}
	
	
	@Test
	public void testFindById() {
		Observation response = observationRepository.findOne("123");

		logger.info(">>>> FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindAll() {
		List<Observation> response = observationRepository.findAll();
		for (Observation observation : response) {
			logger.info(">>>>> Found:" + observation.getId());
		}
        assertTrue(response.size() > 0);
	}
	@Test
	public void testCreate() {
		String id = "12345";
		
		Observation observation1 = new Observation();
		observation1.setId(id);
		Reference ref1 = new Reference("111");
		observation1.setSubject(ref1);
		observationRepository.save(observation1);
		
		Observation response = observationRepository.findOne(id);

		logger.info(">>>> Create FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindBySubjectReference() {
		List<Observation> response = observationRepository.findBySubjectReference("Eudy");
		for (Observation observation : response) {
			logger.info(">>>>> Found BySubjectReference:" + observation.getSubject().getReference());
		}
		assertTrue(response.size() > 0);
	}
	@Test
	public void testWrongSubjectFindBySubjectReference(){
		List<Observation> response = observationRepository.findBySubjectReference("Wrong");
	    logger.info(">>>>> Finding By Bad Subject");
	    assertTrue(response.size() == 0);
	}
	@Test
	public void testWrongIdFindById() {
		Observation response = observationRepository.findOne("Wrong");

		logger.info(">>>> Wrong Id FindById");
		assertNull(response);
	}
	@Test 
	public void testDelete() {
		observationRepository.delete("123");
		
		Observation response = observationRepository.findOne("123");
		logger.info(">>>> Delete 123");
		assertNull(response);
	}
	

}
