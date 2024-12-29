package com.app.dto;

import java.time.LocalDateTime;

import com.app.model.User;

public class UserProfileDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String profilePicture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
	public UserProfileDTO(Long id, String email, String firstName, String lastName, String role, String profilePicture,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.role = role;
		this.profilePicture = profilePicture;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

//	public UserProfileDTO(Long id2, String email2, String firstName2, String lastName2, String string,
//			String profilePicture2, LocalDateTime createdAt2) {
//		// TODO Auto-generated constructor stub
//	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
    
    
    public static UserProfileDTO from(User user) {
        return new UserProfileDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole().toString(),
            user.getProfilePicture(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
    
    
}