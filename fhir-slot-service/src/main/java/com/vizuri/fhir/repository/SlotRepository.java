package com.vizuri.fhir.repository;

import java.util.List;

import org.hl7.fhir.dstu3.model.Slot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SlotRepository extends MongoRepository<Slot, String> {
	
	List<Slot>findByScheduleReference(String schedule);
}
