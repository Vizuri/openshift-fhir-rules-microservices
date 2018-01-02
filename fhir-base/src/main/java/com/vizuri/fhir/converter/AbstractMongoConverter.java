package com.vizuri.fhir.converter;

import java.io.IOException;

import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public abstract class AbstractMongoConverter<T1,T2> implements Converter<T1, T2>  {
	private static Logger logger = LoggerFactory.getLogger(AbstractMongoConverter.class);

	public IBaseResource convertToResource(ObjectMapper objectMapper, DBObject dbObject, Class<?> type) {
		logger.info("Converting dbObject to Resource:"+ dbObject);
		String json = ((BasicDBObject)dbObject).toJson();
		logger.info("JSON:" + json);

		IBaseResource resource = null;
		
		try {
			resource = (IBaseResource)objectMapper.readValue(json, type);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return resource;	
	}
	
	public DBObject convertToDBObject(ObjectMapper objectMapper, IBaseResource resource) {
		logger.info("Converting Resource to DBObject:" + resource);
		
		String json = "";
		try {
			json = objectMapper.writeValueAsString(resource);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		logger.info("ResourceJSON:" + json);
		
		Object o = com.mongodb.util.JSON.parse(json);
		DBObject dbObj = (DBObject) o;
		dbObj.put("_id", resource.getIdElement().getIdPart());
		
		return dbObj;	
	}

}

