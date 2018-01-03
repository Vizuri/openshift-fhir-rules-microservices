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

