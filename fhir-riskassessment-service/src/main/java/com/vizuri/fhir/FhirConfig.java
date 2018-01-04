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

package com.vizuri.fhir;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import org.hl7.fhir.dstu3.model.FamilyMemberHistory;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.QuestionnaireResponse;
import org.hl7.fhir.dstu3.model.RiskAssessment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.CustomConversions;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.mongodb.DBObject;
import com.vizuri.fhir.converter.AbstractMongoConverter;
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
	public CustomConversions customConversions(ObjectMapper objectMapper){
		logger.info("getting customConversions");
		List<Converter>converters = new ArrayList<>();
		
		converters.add(new AbstractMongoConverter<DBObject, RiskAssessment>() {
			@Override
			public RiskAssessment convert(DBObject dbObject) {
				return (RiskAssessment)super.convertToResource(objectMapper, dbObject, RiskAssessment.class);
			}			
		});
		
		converters.add(new AbstractMongoConverter<RiskAssessment, DBObject>(){
			@Override
			public DBObject convert(RiskAssessment riskAssessment) {
				return super.convertToDBObject(objectMapper, riskAssessment);
			}			
		});		
		
		CustomConversions customConversions = new CustomConversions(converters);
		
		return customConversions;
		
	}
	@Bean @Autowired
	public ObjectMapper objectMapper(ResourceSerializer resourceSerializer, ResourceDeserializer resourceDeserializer) {
		ObjectMapper om = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		module.addSerializer(RiskAssessment.class, resourceSerializer);
		module.addDeserializer(RiskAssessment.class, new JsonDeserializer<RiskAssessment>() {

			@Override
			public RiskAssessment deserialize(JsonParser parser, DeserializationContext context)
					throws IOException, JsonProcessingException {
				return (RiskAssessment) resourceDeserializer.deserialize(parser, context);
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
	
		
		module.addSerializer(QuestionnaireResponse.class, resourceSerializer);
		module.addDeserializer(QuestionnaireResponse.class, new JsonDeserializer<QuestionnaireResponse>() {

			@Override
			public QuestionnaireResponse deserialize(JsonParser parser, DeserializationContext context)
					throws IOException, JsonProcessingException {
				return (QuestionnaireResponse) resourceDeserializer.deserialize(parser, context);
			}			
		});	
		
		
		module.addSerializer(FamilyMemberHistory.class, resourceSerializer);
		module.addDeserializer(ArrayList.class, new JsonDeserializer<ArrayList<FamilyMemberHistory>>() {

			@Override
			public ArrayList<FamilyMemberHistory> deserialize(JsonParser parser, DeserializationContext context)
					throws IOException, JsonProcessingException {
				
				ArrayList<FamilyMemberHistory> retList = new ArrayList<FamilyMemberHistory>();
				parser.nextToken();
				
				while(!parser.isClosed()) {
					
					try {
						
						retList.add((FamilyMemberHistory) resourceDeserializer.deserialize(parser, context));
						
					} catch(Exception e) {
						
						parser.nextToken();
					}
				}
				
				return retList;
			}			
		});
		
		om.registerModule(module);
		return om;
	}
	@Bean @Autowired
	public RestTemplate restTemplate(RestTemplateBuilder builder, ObjectMapper objectMapper) {
		RestTemplate restTemplate = builder.build();
		MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter(objectMapper);
		
		mappingJackson2HttpMessageConverter.setSupportedMediaTypes(Arrays.asList(MediaType.APPLICATION_JSON, MediaType.APPLICATION_OCTET_STREAM));		
		restTemplate.getMessageConverters().add(mappingJackson2HttpMessageConverter);

		return restTemplate;
	}

}
