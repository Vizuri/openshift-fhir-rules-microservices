package com.vizuri.fhir.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectOutputStream;

import org.apache.camel.Converter;
import org.apache.camel.TypeConverters;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.QuestionnaireResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ca.uhn.fhir.context.FhirContext;

@Converter
public class FhirTypeConverter implements TypeConverters {

	private static final Logger LOG = LoggerFactory.getLogger(FhirTypeConverter.class);
		
	@Converter
	public static String patientToString(Patient patient)  {
		FhirContext ctx = FhirContext.forDstu3();

		String jsonEncoded = ctx.newJsonParser().encodeResourceToString(patient);
	
		LOG.info("Patient JSON:" + jsonEncoded);
		
		return jsonEncoded;
	}
	
	@Converter
	public static String observationToString(Observation observation)  {
		FhirContext ctx = FhirContext.forDstu3();

		String jsonEncoded = ctx.newJsonParser().encodeResourceToString(observation);
	
		LOG.info("Observation JSON:" + jsonEncoded);
		
		return jsonEncoded;
	}	
	
	@Converter
	public static String questionnaireResponseToString(QuestionnaireResponse questionnaireResponse)  {
		FhirContext ctx = FhirContext.forDstu3();

		String jsonEncoded = ctx.newJsonParser().encodeResourceToString(questionnaireResponse);
	
		LOG.info("QuestionnaireResponse JSON:" + jsonEncoded);
		
		return jsonEncoded;
	}	
	
	@Converter
	public static String bundleToString(Bundle bundle)  {
		FhirContext ctx = FhirContext.forDstu3();

		String jsonEncoded = ctx.newJsonParser().encodeResourceToString(bundle);
	
		LOG.info("Bundle JSON:" + jsonEncoded);
		
		return jsonEncoded;
	}	
	
	@Converter
	public static InputStream bundleToInputStream(Bundle bundle)  {
	    ByteArrayOutputStream baos = new ByteArrayOutputStream();

	    try {
		    ObjectOutputStream oos = new ObjectOutputStream(baos);
	    		oos.writeObject(bundle);
		    oos.flush();
		    oos.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 

	    InputStream is = new ByteArrayInputStream(baos.toByteArray());
	    
	    return is;
	}	
}
