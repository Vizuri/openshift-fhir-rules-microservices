package com.vizuri.fhir;

import static org.junit.Assert.assertTrue;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;

import org.hl7.fhir.dstu3.model.Observation;
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
public class FhirObservationServiceApplicationTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirObservationServiceApplicationTests.class);
	
	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	public void testObservationService() {
		FhirContext ctx = FhirContext.forDstu3();
		
		InputStream is = getClass().getResourceAsStream("/examples-json/Observation-example.json");
		Reader reader = new InputStreamReader(is);
		
		Observation observation = (Observation)ctx.newJsonParser().parseResource(reader);
		String id = observation.getIdElement().getIdPart();
		
		logger.info(">>>>>>Sending Request:" + observation.getId());
		
		ResponseEntity<Observation>retMed = restTemplate.postForEntity("/observation",  observation, Observation.class);
		logger.info(">>>>Create Observation Response:" +retMed.getStatusCodeValue());
		logger.info(">>>>Response Message:" +retMed.getBody());
		assertTrue(retMed.getStatusCodeValue() == 200);
		
		List<Observation>retMeds=restTemplate.getForObject("/observation", List.class);
		
		logger.info("Got observation." +retMeds.size());
		assertTrue(retMeds.size() == 1);
		
		Observation m3 = restTemplate.getForObject("/observation/" +id, Observation.class);
		logger.info("Got Observation." + m3.getId());
		assertTrue(id.equals(m3.getIdElement().getIdPart()));
		
		restTemplate.delete("/observation/"+id);
		
		List<Observation>retMeds2=restTemplate.getForObject("/observation", List.class);
		logger.info("Get Response Type:" +retMeds2.size());
		assertTrue(retMeds2.size()==0);
		
		
	}

}
