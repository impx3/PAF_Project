package com.paf.chop.backend.services;


import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public String toggleFollow(Long currentUserId, Long targetUserId) {
        User current = userRepository.findById(currentUserId).orElse(null);
        User target = userRepository.findById(targetUserId).orElse(null);

        if (current == null || target == null || current.equals(target)) return "Invalid users";

        if (current.getFollowing().contains(target)) {
            current.getFollowing().remove(target);
            target.getFollowers().remove(current);
        } else {
            current.getFollowing().add(target);
            target.getFollowers().add(current);

            // add points for activity
            current.setCoins(current.getCoins() + 10);
            if (current.getCoins() >= 100) {
                current.setIsVerified(true);
            }
        }

        userRepository.save(current);
        userRepository.save(target);
        return "Follow/unfollow successful";
    }

    public Set<User> getFollowers(Long id) {
        User user = userRepository.findById(id).orElse(null);
        return (user != null) ? user.getFollowers() : new HashSet<>();
    }

    public Set<User> getFollowing(Long id) {
        User user = userRepository.findById(id).orElse(null);
        return (user != null) ? user.getFollowing() : new HashSet<>();
    }
}
