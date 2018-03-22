package com.vizuri.fhir.service;

import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ca.uhn.fhir.context.FhirContext;

public class ResponseAggregator implements AggregationStrategy {

	private final static Logger LOGGER = LoggerFactory.getLogger(ResponseAggregator.class);
	
    public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {
        /*
    		String inBody = oldExchange.getIn().getBody(String.class);
        LOGGER.info("Old Exchange body {}", inBody);
    		*/
        String nBody = newExchange.getIn().getBody(String.class);
        LOGGER.info("New Exchange body {}", nBody);
         
        // Bundle with each RiskAssessment
        if (oldExchange == null) {
        		LOGGER.info("Returning new exchange...");
            return newExchange;
        }
        
        
        if (oldExchange.getIn().getBody() == null) {
            Bundle bundle = new Bundle();

    			FhirContext ctx = FhirContext.forDstu3();
    		
    			bundle.addEntry().setResource((Resource) ctx.newJsonParser().parseResource(nBody));
    		
    			String jsonEncoded = ctx.newJsonParser().encodeResourceToString(bundle);
    			LOGGER.info("Creating new bundle with {}", jsonEncoded);
        	
    			oldExchange.getOut().setBody(bundle);
        		
        } else {
        		FhirContext ctx = FhirContext.forDstu3();
        		Bundle bundle = (Bundle) oldExchange.getIn().getBody();

        		bundle.addEntry().setResource((Resource) ctx.newJsonParser().parseResource(nBody));
        		
    			String jsonEncoded = ctx.newJsonParser().encodeResourceToString(bundle);
    			LOGGER.info("Updating bundle to {}", jsonEncoded);
        	
        		oldExchange.getOut().setBody(bundle);
        }

        return oldExchange;
    }

}