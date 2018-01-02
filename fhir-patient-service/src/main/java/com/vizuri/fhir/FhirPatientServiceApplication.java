package com.vizuri.fhir;

import org.hl7.fhir.dstu3.model.Patient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.SpringHandlerInstantiator;

import com.fasterxml.jackson.databind.cfg.HandlerInstantiator;
import com.vizuri.fhir.converter.ResourceDeserializer;
import com.vizuri.fhir.converter.ResourceSerializer;

//import ca.uhn.fhir.model.dstu2.resource.Patient;

//import ca.uhn.fhir.model.dstu2.resource.Patient;

@ComponentScan
@SpringBootApplication
@EnableAutoConfiguration
public class FhirPatientServiceApplication {
	private static Logger logger = LoggerFactory.getLogger(FhirPatientServiceApplication.class);
	public static void main(String[] args) {
		ApplicationContext ctx = SpringApplication.run(FhirPatientServiceApplication.class, args);
	}
//	@Bean
//	public HandlerInstantiator handlerInstantiator(ApplicationContext context) {
//		logger.info("<><< handlerInstantiator <<><<>");
//	    return new SpringHandlerInstantiator(context.getAutowireCapableBeanFactory());
//	}
}
