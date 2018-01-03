package com.vizuri.fhir.repository;

import java.util.Date;
import java.util.List;
import org.hl7.fhir.dstu3.model.Annotation;
import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.FamilyMemberHistory;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.FamilyMemberHistory.FamilyHistoryStatus;
import org.hl7.fhir.dstu3.model.Type;
import org.hl7.fhir.dstu3.model.codesystems.AdministrativeGender;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyMemberHistoryRepository extends MongoRepository<FamilyMemberHistory, String> {


	public List<FamilyMemberHistory> findByIdentifier(@Param("identifier") List identifier);
	//TODO definition
	public List<FamilyMemberHistory> findByStatus(@Param("status") FamilyHistoryStatus status);
	//TODO notDone
	//TODO notDoneReason
	List<FamilyMemberHistory>findByPatientReference(String patient);
	public List<FamilyMemberHistory> findByDate(@Param("date") Date date);
	public List<FamilyMemberHistory> findByName(@Param("name") String name);
	public List<FamilyMemberHistory> findByRelationship(@Param("gender") CodeableConcept relationship);
	public List<FamilyMemberHistory> findByGender(@Param("gender") AdministrativeGender gender);
	public List<FamilyMemberHistory> findByBorn(@Param("born") Type born);
	public List<FamilyMemberHistory> findByEstimatedAge(@Param("estimatedAge") boolean estimatedAge);
	public List<FamilyMemberHistory> findByDeceased(@Param("deceased") Type deceased);
	//TODO reasonCode
	//TODO reasonReference
	public List<FamilyMemberHistory> findByNote(@Param("note") Annotation note);
	public List<FamilyMemberHistory> findByCondition(@Param("condition") List identifier);
	
	@Query("{\"query\":'query'}")
	public List<FamilyMemberHistory> findByQuery(String query);
}