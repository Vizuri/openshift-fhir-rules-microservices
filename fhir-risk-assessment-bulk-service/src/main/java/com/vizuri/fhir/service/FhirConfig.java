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

package com.vizuri.fhir.service;

import java.io.IOException;

import org.apache.camel.component.jackson.JacksonDataFormat;
import org.apache.camel.spi.DataFormat;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.FamilyMemberHistory;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.QuestionnaireResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.vizuri.fhir.converter.ResourceDeserializer;
import com.vizuri.fhir.converter.ResourceSerializer;

import ca.uhn.fhir.context.FhirContext;

@Configuration
public class FhirConfig {
	
	private static Logger logger = LoggerFactory.getLogger(FhirConfig.class);
	
	@Bean @Autowired
	public FhirContext fhirContext(){
		FhirContext fhirContext = FhirContext.forDstu3();
		return fhirContext;
	}
	@Bean @Autowired
	public ResourceDeserializer resourceDeserializer(){
		return new ResourceDeserializer();
	}
	@Bean @Autowired
	public ResourceSerializer resourceSerializer(){
		return new ResourceSerializer();
	}

	@Bean @Autowired
	public ObjectMapper objectMapper(ResourceSerializer resourceSerializer, ResourceDeserializer resourceDeserializer) {
		ObjectMapper om = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		
		module.addSerializer(Bundle.class, resourceSerializer);
		module.addDeserializer(Bundle.class, new JsonDeserializer<Bundle>() {

			@Override
			public Bundle deserialize(JsonParser parser, DeserializationContext context)
					throws IOException, JsonProcessingException {
				return (Bundle) resourceDeserializer.deserialize(parser, context);
			}			
		});
		
		module.addSerializer(Patient.class, resourceSerializer);
		module.addDeserializer(Patient.class, new JsonDeserializer<Patient>() {

			@Override
			public Patient deserialize(JsonParser parser, DeserializationContext context)
					throws IOException, JsonProcessingException {
				return (Patient) resourceDeserializer.deserialize(parser, context);
			}			
		});
		
		module.addSerializer(Observation.class, resourceSerializer);
		module.addDeserializer(Observation.class, new JsonDeserializer<Observation>() {

			@Override
			public Observation deserialize(JsonParser parser, DeserializationContext context)
					throws IOException, JsonProcessingException {
				return (Observation) resourceDeserializer.deserialize(parser, context);
			}			
		});

		module.addSerializer(FamilyMemberHistory.class, resourceSerializer);
		module.addDeserializer(FamilyMemberHistory.class, new JsonDeserializer<FamilyMemberHistory>() {

			@Override
			public FamilyMemberHistory deserialize(JsonParser parser, DeserializationContext context)
					throws IOException, JsonProcessingException {
				return (FamilyMemberHistory) resourceDeserializer.deserialize(parser, context);
			}			
		});
		
		module.addSerializer(QuestionnaireResponse.class, resourceSerializer);
		module.addDeserializer(QuestionnaireResponse.class, new JsonDeserializer<QuestionnaireResponse>() {

			@Override
			public QuestionnaireResponse deserialize(JsonParser parser, DeserializationContext context)
					throws IOException, JsonProcessingException {
				return (QuestionnaireResponse) resourceDeserializer.deserialize(parser, context);
			}			
		});
		
		om.registerModule(module);
		return om;
	}
}
