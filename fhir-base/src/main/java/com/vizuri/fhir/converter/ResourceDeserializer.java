/*
 * Copyright 2015 Vizuri, a business division of AEM Corporation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

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