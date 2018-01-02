package com.vizuri.fhir.converter;

import java.io.IOException;

import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.DataFormatException;
import ca.uhn.fhir.parser.IParser;


public class ResourceSerializer extends JsonSerializer<IBaseResource>{
	@Autowired
	private FhirContext fhirContext;
	
	private static Logger logger = LoggerFactory.getLogger(ResourceSerializer.class);

	@Override
	public void serialize(IBaseResource resource, JsonGenerator generator, SerializerProvider provider)
			throws IOException, JsonProcessingException {
		logger.info("In resource serialize");
		try {
			IParser jsonParser = fhirContext.newJsonParser();
			String encoded = jsonParser.encodeResourceToString(resource);
			logger.info("ResourceString:" + encoded);
			generator.writeRawValue(encoded);
		} catch (DataFormatException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
}
