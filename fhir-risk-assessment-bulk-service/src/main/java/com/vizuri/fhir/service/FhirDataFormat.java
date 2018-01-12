package com.vizuri.fhir.service;

import org.apache.camel.component.jackson.JacksonDataFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;


@Component
public class FhirDataFormat extends JacksonDataFormat {

 
	@Autowired
	public FhirDataFormat(ObjectMapper objectMapper) {
		System.out.println("<><> In JsonDataFormat:" +objectMapper);
		this.setObjectMapper(objectMapper);
    }   
}