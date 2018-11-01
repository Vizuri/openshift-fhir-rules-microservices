package com.vizuri.fhir.test.integration;

import static org.junit.Assert.assertEquals;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.junit.BeforeClass;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;

public class FhirPatientIntegration {
	private static Logger logger = LoggerFactory.getLogger(FhirPatientIntegration.class);


	TestRestTemplate restTemplate = new TestRestTemplate();

	HttpHeaders headers = new HttpHeaders();

	private static String patientJSON = "{\n" + "	\"resourceType\": \"Patient\",\n" + "	\"id\": \"1\",\n"
			+ "	\"name\": [\n" + "		{\n" + "			\"text\": \"Joe E Smith\",\n"
			+ "			\"family\": \"Smith\",\n" + "			\"given\": [\n" + "				\"Joe\",\n"
			+ "				\"E\",\n" + "				\"Smith\"\n" + "			]\n" + "		}\n" + "	],\n"
			+ "	\"gender\": \"male\",\n" + "	\"birthDate\": \"1964-09-10\"\n" + "}";

	private static String baseUrl;
	
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	    baseUrl = System.getProperty("baseUrl");

	}



	@Test
	public void testPatientService2() throws ClientProtocolException, IOException {
		logger.info("creating patient:" + patientJSON);
		HttpClient client = HttpClientBuilder.create().build();
		HttpPost post = new HttpPost(baseUrl +
				"/patient");

		StringEntity params = new StringEntity(patientJSON);
		post.setEntity(params);
		post.addHeader("content-type", "application/json");
		HttpResponse response = client.execute(post);
		System.out.println("Response Code : " + response.getStatusLine().getStatusCode());

		assert (response.getStatusLine().getStatusCode() == 200);

		BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

		StringBuffer result = new StringBuffer();
		String line = "";
		while ((line = rd.readLine()) != null) {
			result.append(line);
		}

		HttpGet get = new HttpGet(baseUrl +
				"/patient/1");

		HttpResponse response2 = client.execute(get);
		System.out.println("Response Code : " + response2.getStatusLine().getStatusCode());

		assert (response2.getStatusLine().getStatusCode() == 200);

		BufferedReader rd2 = new BufferedReader(new InputStreamReader(response2.getEntity().getContent()));

		StringBuffer result2 = new StringBuffer();
		String line2 = "";
		while ((line2 = rd2.readLine()) != null) {
			result2.append(line2);
		}

		assertEquals(result.toString(), result2.toString());

		HttpDelete delete = new HttpDelete(baseUrl + "/patient/1");
		HttpResponse response3 = client.execute(delete);
		System.out.println("Response Code : " + response3.getStatusLine().getStatusCode());

		assert (response3.getStatusLine().getStatusCode() == 200);

	}

}
