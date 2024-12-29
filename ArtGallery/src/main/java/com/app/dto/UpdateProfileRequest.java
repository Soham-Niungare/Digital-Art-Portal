package com.app.dto;

public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String profilePicture;
    
	public UpdateProfileRequest(String firstName, String lastName, String profilePicture) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.profilePicture = profilePicture;
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

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}
    
    
	
}
