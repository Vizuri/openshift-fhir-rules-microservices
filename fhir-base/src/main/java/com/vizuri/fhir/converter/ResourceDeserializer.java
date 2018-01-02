package com.vizuri.fhir.converter;

import java.io.IOException;

import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;

import com.fasterxml.jackson.databind.JsonDeserializer;

import com.fasterxml.jackson.databind.JsonNode;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;



public class ResourceDeserializer extends JsonDeserializer<IBaseResource> {
	private static Logger logger = LoggerFactory.getLogger(ResourceDeserializer.class);

	@Autowired
	private FhirContext fhirContext;

	@Override
	public IBaseResource deserialize(JsonParser parser, DeserializationContext context)
			throws IOException, JsonProcessingException {
		ObjectCodec oc = parser.getCodec();
	
	    JsonNode node = oc.readTree(parser);
	    String json = node.toString();
	    
		logger.info("In Resource desearlize:" + json);
		IParser jsonParser = fhirContext.newJsonParser();
		
		IBaseResource resource = jsonParser.parseResource(json);	
		return resource;
	}
}