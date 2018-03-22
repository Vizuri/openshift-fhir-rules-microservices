package com.vizuri.fhir.service;

import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;

public class RequestAggregator implements AggregationStrategy {

    public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {

        if (oldExchange == null) {
            return newExchange;
        }
        
        oldExchange.getOut().setBody(oldExchange.getIn().getBody());
        oldExchange.getOut().setHeaders(newExchange.getOut().getHeaders());

        return oldExchange;
    }

}