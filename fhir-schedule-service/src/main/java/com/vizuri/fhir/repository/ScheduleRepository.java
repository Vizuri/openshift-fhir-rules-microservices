package com.vizuri.fhir.repository;

import java.util.List;

import org.hl7.fhir.dstu3.model.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends MongoRepository<Schedule, String> {
	List<Schedule> findByActorReference(String actor);
}
