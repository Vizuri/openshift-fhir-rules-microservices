package com.vizuri.fhir;

import static org.junit.Assert.assertTrue;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;

import org.hl7.fhir.dstu3.model.Questionnaire;
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
public class FhirQuestionnaireServiceApplicationTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirQuestionnaireServiceApplicationTests.class);
	
	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	public void testQuestionnaireService() {
		FhirContext ctx = FhirContext.forDstu3();
		
		InputStream is = getClass().getResourceAsStream("/examples-json/Questionnaire-example.json");
		Reader reader = new InputStreamReader(is);
		
		Questionnaire questionnaire = (Questionnaire)ctx.newJsonParser().parseResource(reader);
		String id = questionnaire.getIdElement().getIdPart();
		
		logger.info(">>>>>>Sending Request:" + questionnaire.getId());
		
		ResponseEntity<Questionnaire>retMed = restTemplate.postForEntity("/questionnaire",  questionnaire, Questionnaire.class);
		logger.info(">>>>Create Questionnaire Response:" +retMed.getStatusCodeValue());
		logger.info(">>>>Response Message:" +retMed.getBody());
		assertTrue(retMed.getStatusCodeValue() == 200);
		
		List<Questionnaire>retMeds=restTemplate.getForObject("/questionnaire", List.class);
		
		logger.info("Got Questionnaire." +retMeds.size());
		assertTrue(retMeds.size() == 1);
		
		Questionnaire m3 = restTemplate.getForObject("/questionnaire/" +id, Questionnaire.class);
		logger.info("Got Questionnaire." + m3.getId());
		assertTrue(id.equals(m3.getIdElement().getIdPart()));
		
		restTemplate.delete("/questionnaire/"+id);
		
		List<Questionnaire>retMeds2=restTemplate.getForObject("/questionnaire", List.class);
		logger.info("Get Response Type:" +retMeds2.size());
		assertTrue(retMeds2.size()==0);
		
		
	}

}
