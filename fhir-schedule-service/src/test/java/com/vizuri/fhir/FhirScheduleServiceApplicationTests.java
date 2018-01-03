package com.vizuri.fhir;

import static org.junit.Assert.assertTrue;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;

import org.hl7.fhir.dstu3.model.Schedule;
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
public class FhirScheduleServiceApplicationTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirScheduleServiceApplicationTests.class);
	
	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	public void testScheduleService() {
		FhirContext ctx = FhirContext.forDstu3();
		
		InputStream is = getClass().getResourceAsStream("/examples-json/Schedule-example.json");
		Reader reader = new InputStreamReader(is);
		
		Schedule schedule = (Schedule)ctx.newJsonParser().parseResource(reader);
		String id = schedule.getIdElement().getIdPart();
		
		logger.info(">>>>>>Sending Request:" + schedule.getId());
		
		ResponseEntity<Schedule>retMed = restTemplate.postForEntity("/schedule",  schedule, Schedule.class);
		logger.info(">>>>Create Schedule Response:" +retMed.getStatusCodeValue());
		logger.info(">>>>Response Message:" +retMed.getBody());
		assertTrue(retMed.getStatusCodeValue() == 200);
		
		List<Schedule>retMeds=restTemplate.getForObject("/schedule", List.class);
		
		logger.info("Got Schedule." +retMeds.size());
		assertTrue(retMeds.size() == 1);
		
		Schedule m3 = restTemplate.getForObject("/schedule/" +id, Schedule.class);
		logger.info("Got SChedule." + m3.getId());
		assertTrue(id.equals(m3.getIdElement().getIdPart()));
		
		restTemplate.delete("/schedule/"+id);
		
		List<Schedule>retMeds2=restTemplate.getForObject("/schedule", List.class);
		logger.info("Get Response Type:" +retMeds2.size());
		assertTrue(retMeds2.size()==0);
		
		
	}

}
