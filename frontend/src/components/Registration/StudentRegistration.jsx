import React from "react";
import { useState } from "react";
import Select from "react-select";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";


import { colleges, courses,careerGoals,skills,hearAbout,mentorTypes,mentorshipAreas} from "../../assets/assets";


const StudentRegistration = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    college: "",
    enrollment: "",
    verificationFile: null,
    course: "",
    year: "",
    skills: [],
    careerGoal: "",
    hearAbout: "",
    purposes: [],
    mentorshipArea: "",
    mentorType: "",
    communication: [],
    notifications: {
      mentorship: true,
      events: true,
      community: false,
      content: true,
    },
  });
  // Validation for each step
  // Password validation regex: at least one uppercase, one number, one special character, min 8 chars
          const passwordValid = /^(?=.[A-Z])(?=.\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(formData.password);
          const confirmPasswordValid = formData.password === formData.confirmPassword;

          const isStepValid = () => {
            switch (step) {
              case 0:
                return (
                  formData.fullName.trim() &&
                  formData.email.trim() &&
                  formData.password.trim() &&
                  formData.confirmPassword.trim() &&
                  formData.phone.trim() &&
                  passwordValid &&
                  confirmPasswordValid
                );
              case 1:
                return (
                  formData.college &&
                  formData.enrollment.trim() &&
                  formData.verificationFile
                );
              case 2:
                return (
                  formData.course &&
                  formData.year &&
                  formData.skills.length > 0 &&
                  formData.careerGoal
                );
              case 3:
                return (
                  formData.hearAbout &&
                  formData.mentorshipArea
                );
              case 4:
                return (
                  formData.mentorType &&
                  formData.communication.length > 0
                );
              default:
                return true;
            }
          };
          const steps = [
            "Account Setup",
            "Student Verification",
            "Profile Details",
            "Discovery Insights",
            "Preferences & Notifications",
            "Review & Submit",
          ];

 

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Progress Steps */}
      <div className="flex justify-between mb-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i <= step ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {i + 1}
            </div>
            <p className="text-xs mt-2">{s}</p>
          </div>
        ))}
      </div>
      {/* Progress Line */}
      <div className="relative h-2 mb-6">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 rounded-full" style={{ transform: 'translateY(-50%)' }}></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
          style={{
            width: ${(step / (steps.length - 1)) * 100}%,
            transform: 'translateY(-50%)',
          }}
        ></div>
      </div>

      {/* Step Forms */}
      {step === 0 && (
        <div className="border p-6 rounded-lg shadow-md">
          <div className="w-full h-full text-center py-10 px-4 bg-purple-800 ">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Start Your Journey with StuAlum
              </h2>
              <h4 className="text-sm md:text-base text-gray-200">
                Enter your basic details to create your student account.
              </h4>
          </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Account Setup</h2>
                  <p>Create your profile by providing your essential contact and security details.</p>
                  
                  <div className="flex gap-4 mb-3">
                    <div className="w-1/2">
                      <h4>Full Name</h4>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="border p-2 w-full"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="w-1/2">
                      <h4>Email</h4>
                      <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 w-full"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <p >A verification link will be sent to this email</p>
                    </div>
                    
                  </div>
                  
                  <div className="flex gap-4 mb-3">
                    <div className="w-1/2">
                      <h4>Password</h4>
                      <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 w-full"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      
                      {!passwordValid && formData.password && (
                        <p className="text-red-500 text-xs mb-2">Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.</p>
                      )}
                      <p>Use at least one uppercase letter, one number, one special character, and minimum 8 characters.</p>
                    </div>
                    <div className="w-1/2">
                      <h4>Confirm Password</h4>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="border p-2 w-full"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                      />
                      {!confirmPasswordValid && formData.confirmPassword && (
                        <p className="text-red-500 text-xs mb-2">Confirm password should match the password.</p>
                      )}
                    </div>
                  </div>
                  <h4>Phone Number</h4>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="border p-2 w-full mb-3"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
             </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {step==1 &&(
        <div>
          <h2 className="text-lg font-semibold mb-4">Verification Detials</h2>
          <h3>College/University</h3>
          <Select
                options={colleges}
                placeholder="Select your college or university"
                value={colleges.find((c) => c.value === formData.college) || null}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, college: selectedOption.value })
                }
                className="mb-3"
          />
          <h3>Enrollment Number </h3>
          <input
            type="text"
            placeholder="Enter your enrollment number"
            className="border p-2 w-full mb-3"
            value={formData.enrollment}
            onChange={(e) =>
              setFormData({ ...formData, enrollment: e.target.value })
            }
          />
          <h3>Verification Method</h3>
          <label
                htmlFor="studentIdUpload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition"
                >
                <CloudArrowUpIcon className="h-10 w-10 text-blue-500 mb-2" />
                <p className="font-medium text-gray-700">Upload Student ID</p>
                <p className="text-xs text-gray-500 mt-1">
                  Securely upload a photo of your valid student ID
                </p>
                <input
                  id="studentIdUpload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 10 * 1024 * 1024) {
                        alert("File size should not exceed 10 MB");
                        return;
                      }
                      setFormData({ ...formData, verificationFile: file });
                    }
                  }}
                />
           </label>

           <h4 className="mt-3">Accepted formats:JPG,PNG,PDF(MAX:5 MB)</h4>
        </div>
      )}

      {/* step:3 */}

      {step==2 &&(
        <div>
          <h2 className="text-lg justify font-semibold mb-4">Profile Details</h2>
          <h3>Courses & Specialization</h3>
          <Select
                options={courses}
                placeholder="Select your college or university"
                value={courses.find((c) => c.value === formData.course) || null}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, course: selectedOption.value })
                }
                className="mb-3"
          />
          <h3>Year of Study</h3>
          <Select
                options={[
                  { value: "1st", label: "1st Year" },
                  { value: "2nd", label: "2nd Year" },
                  { value: "3rd", label: "3rd Year" },
                  { value: "4th", label: "4th Year" },
                ]}
                placeholder="Select year of study"
                value={formData.year ? { value: formData.year, label: ${formData.year} Year } : null}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, year: selectedOption.value })
                }
          />

          <h3>Skills & Interests</h3>
          <Select
              options={skills}
              isMulti
              placeholder="Type or select skills/interests"
              value={skills.filter((s) => formData.skills.includes(s.value))}
              onChange={(selectedOptions) => {
                if (selectedOptions.length <= 10) {
                  setFormData({
                    ...formData,
                    skills: selectedOptions.map((s) => s.value),
                  });
                } else {
                  alert("You can select a maximum of 10 skills");
                }
              }}
              className="mb-3"
          />

          {/* to show selected skills */}

          {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
          )}

        <h3>Career Goals</h3>
          <Select
                options={careerGoals}
                placeholder="Select your college or university"
                value={careerGoals.find((c) => c.value === formData.careerGoal) || null}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, careerGoal: selectedOption.value })
                }
                className="mb-3"
          />
        </div>
      )}

      {/* Step=3 */}
      {step==3 && (
        <div>
          <h2>Discovery Insights</h2>
          <h4>How did you hear about us?</h4>
          <Select
              options={hearAbout}
              placeholder="How did you hear about us?"
              value={hearAbout.find((h) => h.value === formData.hearAbout) || null}
              onChange={(selectedOption) =>
                setFormData({ ...formData, hearAbout: selectedOption.value })
              }
          />
          <h4>What are you here for ?</h4>

          <h4>Areas of Mentorship</h4>
          <Select
              options={mentorshipAreas}
              placeholder="Select area of mentorship"
              value={mentorshipAreas.find((m) => m.value === formData.mentorshipArea) || null}
              onChange={(selectedOption) =>
                setFormData({ ...formData, mentorshipArea: selectedOption.value })
              }
          />
        </div>
      )}

      {step==4 &&(
        <div>
          <h2>Preferences & Notifications</h2>

          <h4 c>Preferred Mentor Type</h4>
          <Select
              options={mentorTypes}
              placeholder="Select preferred mentor type"
              value={mentorTypes.find((m) => m.value === formData.mentorType) || null}
              onChange={(selectedOption) =>
                setFormData({ ...formData, mentorType: selectedOption.value })
              }
          />
          <h4>Preferred Communication Method</h4>
          <div className="flex flex-col gap-4 mt-2">
            {["In-app Chat", "Email", "Phone/WhatsApp"].map((method) => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={method}
                  checked={formData.communication.includes(method)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        communication: [...formData.communication, e.target.value],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        communication: formData.communication.filter(
                          (c) => c !== e.target.value
                        ),
                      });
                    }
                  }}
                  className="h-4 w-4"
                />
                {method}
              </label>
            ))}
          </div>
          <h4 className="mt-6 font-semibold">Notification Preferences</h4>
          <div className="flex flex-col gap-4 mt-2">
            {[
              { key: "mentorship", label: "Mentorship Updates" },
              { key: "events", label: "Event Notifications" },
              { key: "community", label: "Community Updates" },
              { key: "content", label: "Content Updates" },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between border p-3 rounded-lg"
              >
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={formData.notifications[item.key]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        [item.key]: e.target.checked,
                      },
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
      )}
      
      {/* Review & Submit Section */}
      {step === 5 && (
        <div className="bg-[#1E0033] text-white p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-center mb-2">Review Your Information</h2>
          <p className="text-center text-gray-300 mb-8">
            Please review all the details below. Click <span className="font-semibold">Edit</span> to update any section.
          </p>

          {/* Account Setup */}
          <div className="bg-[#2A0E45] p-5 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Account Setup</h3>
              <button onClick={() => setStep(0)} className="text-purple-400 text-sm">Edit</button>
            </div>
            <p><strong>Full Name:</strong> {formData.fullName || "Not provided"}</p>
            <p><strong>Email:</strong> {formData.email || "Not provided"}</p>
            <p><strong>Phone:</strong> {formData.phone || "Not provided"}</p>
          </div>

          {/* Student Verification */}
          <div className="bg-[#2A0E45] p-5 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Student Verification</h3>
              <button onClick={() => setStep(1)} className="text-purple-400 text-sm">Edit</button>
            </div>
            <p><strong>College:</strong> {formData.college || "Not provided"}</p>
            <p><strong>Enrollment:</strong> {formData.enrollment || "Not provided"}</p>
            <p><strong>ID File:</strong> {formData.verificationFile ? "Uploaded" : "Not uploaded"}</p>
          </div>

          {/* Profile Details */}
          <div className="bg-[#2A0E45] p-5 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Profile Details</h3>
              <button onClick={() => setStep(2)} className="text-purple-400 text-sm">Edit</button>
            </div>
            <p><strong>Course:</strong> {formData.course || "Not provided"}</p>
            <p><strong>Year:</strong> {formData.year || "Not provided"}</p>
            <p>
              <strong>Skills:</strong>{" "}
              {formData.skills.length > 0 ? formData.skills.join(", ") : "None"}
            </p>
            <p><strong>Career Goal:</strong> {formData.careerGoal || "Not provided"}</p>
          </div>

          {/* Discovery Insights */}
          <div className="bg-[#2A0E45] p-5 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Discovery Insights</h3>
              <button onClick={() => setStep(3)} className="text-purple-400 text-sm">Edit</button>
            </div>
            <p><strong>Heard About Us:</strong> {formData.hearAbout || "Not provided"}</p>
            <p><strong>Mentorship Area:</strong> {formData.mentorshipArea || "Not provided"}</p>
          </div>

          {/* Preferences & Notifications */}
          <div className="bg-[#2A0E45] p-5 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Preferences & Notifications</h3>
              <button onClick={() => setStep(4)} className="text-purple-400 text-sm">Edit</button>
            </div>
            <p><strong>Mentor Type:</strong> {formData.mentorType || "Not selected"}</p>
            <p>
              <strong>Communication:</strong>{" "}
              {formData.communication.length > 0 ? formData.communication.join(", ") : "None"}
            </p>
            <p><strong>Notifications:</strong></p>
            <ul>
              <li>Mentorship: {formData.notifications.mentorship ? "Yes" : "No"}</li>
              <li>Events: {formData.notifications.events ? "Yes" : "No"}</li>
              <li>Community: {formData.notifications.community ? "Yes" : "No"}</li>
              <li>Content: {formData.notifications.content ? "Yes" : "No"}</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => alert("Form Submitted!")}
              className="px-8 py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit & Create Account
            </button>
          </div>
        </div>
      )}
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 0 && step < steps.length && (
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Back
          </button>
        )}

        {step < steps.length - 1 && (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={px-4 py-2 rounded-lg font-semibold transition ${isStepValid() ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-500 cursor-not-allowed"}}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};



export default StudentRegistration;