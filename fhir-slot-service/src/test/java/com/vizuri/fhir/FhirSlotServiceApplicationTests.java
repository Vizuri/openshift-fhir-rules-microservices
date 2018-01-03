package com.vizuri.fhir;

import static org.junit.Assert.assertTrue;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;

import org.hl7.fhir.dstu3.model.Slot;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import ca.uhn.fhir.context.FhirContext;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations="classpath:application-test.properties")
public class FhirSlotServiceApplicationTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirSlotServiceApplicationTests.class);
	
	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	public void testSlotService() {
		FhirContext ctx = FhirContext.forDstu3();
		
		InputStream is = getClass().getResourceAsStream("/examples-json/Slot-example-2.json");
		Reader reader = new InputStreamReader(is);
		
		Slot slot = (Slot)ctx.newJsonParser().parseResource(reader);
		String id = slot.getIdElement().getIdPart();
		
		logger.info(">>>>>>Sending Request:" + slot.getId());
		
		ResponseEntity<Slot>retMed = restTemplate.postForEntity("/slot",  slot, Slot.class);
		logger.info(">>>>Create Slot Response:" +retMed.getStatusCodeValue());
		logger.info(">>>>Response Message:" +retMed.getBody());
		assertTrue(retMed.getStatusCodeValue() == 200);
		
		List<Slot>retMeds=restTemplate.getForObject("/slot", List.class);
		
		logger.info("Got Slot." +retMeds.size());
		assertTrue(retMeds.size() == 1);
		
		Slot m3 = restTemplate.getForObject("/slot/" +id, Slot.class);
		logger.info("Got Slot." + m3.getId());
		assertTrue(id.equals(m3.getIdElement().getIdPart()));
		
		restTemplate.delete("/slot/"+id);
		
		List<Slot>retMeds2=restTemplate.getForObject("/slot", List.class);
		logger.info("Get Response Type:" +retMeds2.size());
		assertTrue(retMeds2.size()==0);
		
		
	}

}
