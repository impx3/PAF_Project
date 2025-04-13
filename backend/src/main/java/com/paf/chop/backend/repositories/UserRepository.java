package com.paf.chop.backend.repositories;

import com.paf.chop.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
// public interface UserRepository extends MongoRepository<User, String>
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
    User findByEmail(String email);
}
