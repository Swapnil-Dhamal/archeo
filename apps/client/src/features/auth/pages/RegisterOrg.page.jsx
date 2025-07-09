"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import OrganizationStepForm from "@/features/auth/components/sub-components/register/organization-step-form.sc.jsx";
import { ROUTES } from "@/shared/constants/routes.constant.js";
import LogoText from "@/components/brand/LogoText.sc.jsx";
import {
	Validators,
	validatorsNames,
} from "@/features/auth/validators/form.validator.js";
import { toast, Bounce } from "react-toastify";
import CustomButton from "@/components/Button/CustomButton.jsx";

import {
	Building,
	Globe,
	User,
	Shield,
	Phone,
	MapPin,
	FileText,
	QrCode,
	BookOpenText,
	Contact,
	UserRound,
	SquareArrowOutUpRight,
} from "lucide-react";


// Organization form categories with their respective fields and validation rules
const organizationCategories = [
	{
		category: "Basic Info",
		icon: <BookOpenText size={18} />,
		title: "Tell us about your organization",
		description: "Basic information about your organization",
		checklistKey: "BasicInfoStageCompleted",
		fields: [
			{
				field: "orgname",
				label: "What's your organization name?",
				placeholder: "Enter organization name",
				description: "The official name of your organization",
				customData: {
					icon: <Building />,
					text: "Organization Name",
					name: "orgname",
					required: true,
					maxLength: 100,
					minLength: 2,
				},
				validation: {
					validator: validatorsNames.ONLY_ALPHA_NUMERIC,
					options: {
						minLength: 2,
						maxLength: 100,
						allowSpecialChars: ".,&()-",
					},
				},
			},
			{
				field: "orgtype",
				label: "What type of organization is this?",
				placeholder: "Select organization type",
				description:
					"Choose the category that best describes your organization",
				customData: {
					icon: <Building />,
					text: "Organization Type",
					name: "orgtype",
					required: true,
					options: [
						{ value: "government", label: "Government" },
						{
							value: "educational institution",
							label: "Educational Institution",
						},
						{ value: "commercial entity", label: "Commercial Entity" },
						{
							value: "non-governmental organization",
							label: "Non-Governmental Organization",
						},
						{
							value: "hospital / medical institution",
							label: "Hospital / Medical Institution",
						},
						{ value: "financial institution", label: "Financial Institution" },
						{
							value: "legal / judicial authority",
							label: "Legal / Judicial Authority",
						},
						{
							value: "research & development body",
							label: "Research & Development Body",
						},
						{ value: "regulatory authority", label: "Regulatory Authority" },
						{ value: "military / defense", label: "Military / Defense" },
						{
							value: "embassy / diplomatic mission",
							label: "Embassy / Diplomatic Mission",
						},
						{
							value: "accredited lab / testing facility",
							label: "Accredited Lab / Testing Facility",
						},
						{
							value: "utility / infrastructure provider",
							label: "Utility / Infrastructure Provider",
						},
						{
							value: "training & certification body",
							label: "Training & Certification Body",
						},
						{ value: "other", label: "Other" },
					],
				},
				validation: {
					validator: validatorsNames.VALUE_IN_GIVEN_ARRAY,
					options: {
						allowedValues: [
							"government",
							"educational institution",
							"commercial entity",
							"non-governmental organization",
							"hospital / medical institution",
							"financial institution",
							"legal / judicial authority",
							"research & development body",
							"regulatory authority",
							"military / defense",
							"embassy / diplomatic mission",
							"accredited lab / testing facility",
							"utility / infrastructure provider",
							"training & certification body",
							"other",
						],
						caseSensitive: false,
					},
				},
			},
		],
	},
	{
		category: "Contact Info",
		icon: <Contact size={18} />,
		title: "Where can we find you?",
		description: "Contact and location information",
		checklistKey: "ContactInfoStageCompleted",
		fields: [
			{
				field: "website",
				label: "What's your organization's website?",
				placeholder: "https://yourorganization.com",
				description: "Your official website URL (optional)",
				customData: {
					icon: <Globe />,
					text: "Website",
					name: "website",
					required: true,
				},
			},
			{
				field: "address",
				label: "Where is your organization located?",
				placeholder: "Enter your complete address",
				description:
					"Full address including street, city, state, and postal code",
				customData: {
					icon: <MapPin />,
					text: "Address",
					name: "address",
					required: true,
				},
				validation: {
					validator: validatorsNames.ADDRESS_VALIDATOR,
					options: {
						minLineLength: 3,
						maxTotalLength: 300,
					},
				},
			},
		],
	},
	{
		category: "Contact Person",
		icon: <UserRound size={18} />,
		title: "Who should we contact?",
		description: "Primary contact person details",
		checklistKey: "ContactPersonStageCompleted",
		fields: [
			{
				field: "contactname",
				label: "What's the contact person's name?",
				placeholder: "Enter full name",
				description: "Full name of the primary contact person",
				customData: {
					icon: <User />,
					text: "Contact Name",
					name: "contactname",
					required: true,
					maxLength: 50,
					minLength: 2,
				},
				validation: {
					validator: validatorsNames.ONLY_ALPHA,
					options: {
						minLength: 2,
						maxLength: 50,
					},
				},
			},
			{
				field: "designation",
				label: "What's their designation?",
				placeholder: "Enter job title or position",
				description: "Job title or position in the organization",
				customData: {
					icon: <User />,
					text: "Designation",
					name: "designation",
					required: true,
					maxLength: 50,
				},
				validation: {
					validator: validatorsNames.ONLY_ALPHA_NUMERIC,
					options: {
						minLength: 2,
						maxLength: 50,
						allowSpecialChars: ".,&()-/",
					},
				},
			},
			{
				field: "phonenumber",
				label: "What's their phone number?",
				placeholder: "Enter phone number",
				description: "Primary contact phone number",
				customData: {
					icon: <Phone />,
					text: "Phone Number",
					name: "phonenumber",
					required: true,
				},
				validation: {
					validator: validatorsNames.PHONE_NUMBER,
					options: {
						country: "IN",
					},
				},
			},
		],
	},
	{
		category: "Verification",
		icon: <QrCode size={18} />,
		title: "Verify your organization",
		description: "Upload documents to verify your organization",
		checklistKey: "VerificationStageCompleted",
		fields: [
			{
				field: "prooftype",
				label: "What type of proof document?",
				placeholder: "Select document type",
				description: "Choose the type of verification document",
				customData: {
					icon: <Shield />,
					text: "Proof Type",
					name: "prooftype",
					required: true,
					options: [
						{ value: "gst certificate", label: "GST Certificate" },
						{
							value: "company incorporation certificate",
							label: "Company Incorporation Certificate",
						},
						{ value: "organization pan card", label: "Organization PAN Card" },
						{
							value: "udyam / msme certificate",
							label: "Udyam / MSME Certificate",
						},
						{
							value: "ngo registration certificate",
							label: "NGO Registration Certificate",
						},
						{
							value: "government issuance letter",
							label: "Government Issuance Letter",
						},
						{ value: "operational license", label: "Operational License" },
						{
							value: "tax registration document",
							label: "Tax Registration Document",
						},
						{
							value: "mou with government body",
							label: "MOU with Government Body",
						},
						{
							value: "regulatory registration certificate",
							label: "Regulatory Registration Certificate",
						},
						{ value: "insurance certificate", label: "Insurance Certificate" },
						{
							value: "letter of consent / authorization",
							label: "Letter of Consent / Authorization",
						},
						{
							value: "identity proof of authorized signatory",
							label: "Identity Proof of Authorized Signatory",
						},
						{
							value: "address proof (utility bill, rent agreement)",
							label: "Address Proof (Utility Bill, Rent Agreement)",
						},
						{
							value: "business registration number proof",
							label: "Business Registration Number Proof",
						},
						{ value: "tax", label: "Tax Registration" },
						{ value: "other", label: "Other Government Document" },
					],
				},
				validation: {
					validator: validatorsNames.VALUE_IN_GIVEN_ARRAY,
					options: {
						allowedValues: [
							"gst certificate",
							"company incorporation certificate",
							"organization pan card",
							"udyam / msme certificate",
							"ngo registration certificate",
							"government issuance letter",
							"operational license",
							"tax registration document",
							"mou with government body",
							"regulatory registration certificate",
							"insurance certificate",
							"letter of consent / authorization",
							"identity proof of authorized signatory",
							"address proof (utility bill, rent agreement)",
							"business registration number proof",
							"tax",
							"other",
						],
						caseSensitive: false,
					},
				},
			},
			{
				field: "prooffilename",
				label: "Upload your verification document",
				placeholder: "Choose file to upload",
				description: "Upload a clear copy of your verification document",
				customData: {
					icon: <FileText />,
					text: "Verification Document",
					name: "prooffilename",
					required: true,
					fileTypes: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".rtf"],
					maxSize: "5MB",
				},
				validation: {
					validator: validatorsNames.FILE_VALIDATOR,
					options: {
						maxSize: 5 * 1024 * 1024, // 5MB
						allowedTypes: [
							"application/pdf",
							"application/msword",
							"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
							"application/vnd.ms-excel",
							"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							"text/plain",
							"application/rtf",
						],
						allowedExtensions: [
							"pdf",
							"doc",
							"docx",
							"xls",
							"xlsx",
							"txt",
							"rtf",
						],
					},
				},
			},
		],
	},
];

function RegisterOrgPage() {
	const navigate = useNavigate();
	// State management
	const [currentCategory, setCurrentCategory] = useState(0);
	const [direction, setDirection] = useState("forward");
	const [formData, setFormData] = useState({
		orgname: "",
		orgtype: "",
		website: "",
		address: {},
		contactname: "",
		designation: "",
		phonenumber: "",
		prooftype: "",
		prooffilename: null,
	});
	const [checklist, setChecklist] = useState({
		BasicInfoStageCompleted: false,
		ContactInfoStageCompleted: false,
		ContactPersonStageCompleted: false,
		VerificationStageCompleted: false,
	});
	const [fieldErrors, setFieldErrors] = useState({});
	const [touchedFields, setTouchedFields] = useState({});

	// Helper functions
	const currentCategoryData = organizationCategories[currentCategory];
	const totalCategories = organizationCategories.length;
	const isLastCategory = currentCategory === totalCategories - 1;

	// Calculate progress
	const progress = {
		overall: Math.round(((currentCategory + 1) / totalCategories) * 100),
	};

	// Enhanced field validation using external validator
	const validateField = (field, value, showError = true) => {
		// Skip validation if field is not required and value is empty
		if (
			!field.customData?.required &&
			(!value || (typeof value === "string" && value.trim() === ""))
		) {
			return { isValid: true, errorMessage: null };
		}

		// Handle address field validation specially
		if (field.field === "address") {
			// Check if field is required and empty
			if (field.customData?.required) {
				if (!value || typeof value !== "object") {
					return {
						isValid: false,
						errorMessage: `${field.customData.text} is required.`,
					};
				}

				// Check if all address lines are empty
				const hasAnyAddressLine =
					(value.address1 && value.address1.trim()) ||
					(value.address2 && value.address2.trim()) ||
					(value.address3 && value.address3.trim());

				if (!hasAnyAddressLine) {
					return {
						isValid: false,
						errorMessage: `${field.customData.text} is required.`,
					};
				}
			}

			// If validation rules exist, process them
			if (field.validation) {
				const { validator, options = {} } = field.validation;
				const validatorFunction = Validators[validator];

				if (!validatorFunction) {
					console.warn(
						`Validator '${validator}' not found for field '${field.field}'`
					);
					return { isValid: true, errorMessage: null };
				}

				// Convert address object to array format expected by validator
				const addressLines = [
					value.address1 || "",
					value.address2 || "",
					value.address3 || "",
				].filter((line) => line.trim() !== "");

				return validatorFunction(field.field, addressLines, options);
			}

			return { isValid: true, errorMessage: null };
		}

		// Check if field is required and empty (for non-address fields)
		if (
			field.customData?.required &&
			(!value ||
				(typeof value === "string" && value.trim() === "") ||
				(typeof value === "object" && !value))
		) {
			return {
				isValid: false,
				errorMessage: `${field.customData.text} is required.`,
			};
		}

		// Skip validation if no validation rules defined
		if (!field.validation) {
			// Handle website URL validation
			if (field.field === "website" && value) {
				// First check if it's a valid URL format
				try {
					new URL(value);
					// If URL is valid, use the alphanumeric validator for additional checks
					return { isValid: true, errorMessage: null };
				} catch {
					return {
						isValid: false,
						errorMessage:
							"Please enter a valid website URL (e.g., https://example.com)",
					};
				}
			}
			return { isValid: true, errorMessage: null };
		}

		const { validator, options = {} } = field.validation;
		const validatorFunction = Validators[validator];

		if (!validatorFunction) {
			console.warn(
				`Validator '${validator}' not found for field '${field.field}'`
			);
			return { isValid: true, errorMessage: null };
		}

		// Handle special cases for different field types
		let valueToValidate = value;

		// Handle file field
		if (field.field === "prooffilename" && value && value.file) {
			valueToValidate = value.file;
		}

		return validatorFunction(field.customData.text, valueToValidate, options);
	};

	// Real-time validation function
	const validateFieldRealTime = (fieldName, value) => {
		const field = organizationCategories
			.flatMap((cat) => cat.fields)
			.find((f) => f.field === fieldName);

		if (!field) return;

		const result = validateField(field, value);

		// Update field errors immediately
		setFieldErrors((prev) => ({
			...prev,
			[fieldName]: result.isValid ? null : result.errorMessage,
		}));

		return result.isValid;
	};

	// Check if a specific category is valid
	const isCategoryValid = (categoryIndex) => {
		const category = organizationCategories[categoryIndex];
		return category.fields.every((field) => {
			const value = formData[field.field];
			const result = validateField(field, value);
			return result.isValid;
		});
	};

	// Check if navigation to a category is allowed
	const isNavigationAllowed = (targetCategoryIndex) => {
		// Can always navigate to the first category
		if (targetCategoryIndex === 0) return true;

		// Check if all previous categories are valid
		for (let i = 0; i < targetCategoryIndex; i++) {
			if (!isCategoryValid(i)) {
				return false;
			}
		}

		return true;
	};

	const areAllCategoryFieldsValid = () => {
		return currentCategoryData.fields.every((field) => {
			const value = formData[field.field];
			const result = validateField(field, value);
			return result.isValid;
		});
	};

	// Get field error message
	const getFieldError = (fieldName) => {
		return fieldErrors[fieldName] || null;
	};

	// Update category completion whenever formData changes
	useEffect(() => {
		// Update completion status for all categories
		organizationCategories.forEach((category, index) => {
			const isCompleted = isCategoryValid(index);
			setChecklist((prev) => ({
				...prev,
				[category.checklistKey]: isCompleted,
			}));
		});
	}, [formData]);

	// Event handlers
	const handleInputChange = (fieldName, value) => {
		setFormData((prev) => ({
			...prev,
			[fieldName]: value,
		}));

		// Mark field as touched
		setTouchedFields((prev) => ({
			...prev,
			[fieldName]: true,
		}));

		// Validate field in real-time
		validateFieldRealTime(fieldName, value);
	};

	const handleNext = () => {
		// Validate all fields in current category
		const currentErrors = {};
		let hasErrors = false;

		currentCategoryData.fields.forEach((field) => {
			const value = formData[field.field];
			const result = validateField(field, value);
			if (!result.isValid) {
				currentErrors[field.field] = result.errorMessage;
				hasErrors = true;
			}
		});

		if (hasErrors) {
			setFieldErrors((prev) => ({
				...prev,
				...currentErrors,
			}));

			// Mark all fields in current category as touched
			const touchedFields = {};
			currentCategoryData.fields.forEach((field) => {
				touchedFields[field.field] = true;
			});
			setTouchedFields((prev) => ({
				...prev,
				...touchedFields,
			}));

			return;
		}

		setDirection("forward");
		if (!isLastCategory) {
			setCurrentCategory((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		setDirection("backward");
		if (currentCategory > 0) {
			setCurrentCategory((prev) => prev - 1);
		}
	};

	const handleCategoryChange = (categoryIndex) => {
		if (
			categoryIndex < 0 ||
			categoryIndex >= totalCategories ||
			categoryIndex === currentCategory
		) {
			return;
		}

		// Check if navigation is allowed
		if (!isNavigationAllowed(categoryIndex)) {
			// Show toast message indicating which category needs to be completed
			const incompleteCategory = organizationCategories.find(
				(_, index) => index < categoryIndex && !isCategoryValid(index)
			);

			if (incompleteCategory) {
				toast.error(
					`Please complete the "${incompleteCategory.category}" section before proceeding.`,
					{
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: false,
						progress: undefined,
						theme: "dark",
						transition: Bounce,
					}
				);
			}
			return;
		}

		setDirection(categoryIndex > currentCategory ? "forward" : "backward");
		setCurrentCategory(categoryIndex);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && areAllCategoryFieldsValid()) {
			if (isLastCategory) {
				handleSubmit();
			} else {
				handleNext();
			}
		}
	};

	const resetForm = () => {
		setCurrentCategory(0);
		setDirection("forward");
		setFormData({
			orgname: "",
			orgtype: "",
			website: "",
			address: {},
			contactname: "",
			designation: "",
			phonenumber: "",
			prooftype: "",
			prooffilename: null,
		});
		setChecklist({
			BasicInfoStageCompleted: false,
			ContactInfoStageCompleted: false,
			ContactPersonStageCompleted: false,
			VerificationStageCompleted: false,
		});
		setFieldErrors({});
		setTouchedFields({});
	};

	const handleSubmit = async () => {
		// Final validation of all fields
		const allErrors = {};
		let hasErrors = false;

		organizationCategories.forEach((category) => {
			category.fields.forEach((field) => {
				const value = formData[field.field];
				const result = validateField(field, value);
				if (!result.isValid) {
					allErrors[field.field] = result.errorMessage;
					hasErrors = true;
				}
			});
		});

		if (hasErrors) {
			setFieldErrors(allErrors);
			toast.error("Please fix all validation errors before submitting.", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: false,
				progress: undefined,
				theme: "dark",
				transition: Bounce,
			});
			return;
		}

		console.log("Organization Registration Data:", formData);
		console.log("Completion Checklist:", checklist);

		// Prepare form data for backend submission
		const formDataToSubmit = new FormData();

		// Add all text fields to FormData
		formDataToSubmit.append("orgname", formData.orgname);
		formDataToSubmit.append("orgtype", formData.orgtype);
		formDataToSubmit.append("website", formData.website);
		formDataToSubmit.append("contactname", formData.contactname);
		formDataToSubmit.append("designation", formData.designation);
		formDataToSubmit.append("phonenumber", formData.phonenumber);
		formDataToSubmit.append("prooftype", formData.prooftype);

		// Handle address object
		if (formData.address && typeof formData.address === "object") {
			formDataToSubmit.append("address", JSON.stringify(formData.address));
		} else {
			formDataToSubmit.append("address", formData.address || "");
		}

		// Handle file upload
		if (formData.prooffilename && formData.prooffilename.file) {
			formDataToSubmit.append("prooffile", formData.prooffilename.file);
		}

		// Add completion checklist
		formDataToSubmit.append("checklist", JSON.stringify(checklist));
	};

	return (
		<div className="relative min-h-screen bg-background">
			{/* Header with Project Name and Quit Button */}
			<div className="mx-auto flex w-full items-center justify-between">
				{/* Project Name */}
				<div className="w-full">
					<div className="box pt-4 pl-4">
						<LogoText />
					</div>
				</div>

				{/* Quit Button */}
				<CustomButton
					onClick={() => navigate(ROUTES.HOME)}
					text="Quit"
					variant="destructive"
					size="small"
					icon={<SquareArrowOutUpRight size={16} />}
					iconPosition="right"
					width="100px"
					height="35px"
					className="mr-2 cursor-pointer"
				/>
			</div>

			{/* Main Content */}
			<div className="mx-auto max-w-4xl">
				{/* Progress indicator */}
				<div className="px-1">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold text-foreground">
							{currentCategoryData.title}
						</h2>
						<div className="text-sm text-muted-foreground">
							Step {currentCategory + 1} of {totalCategories}
						</div>
					</div>

					{/* Overall progress */}
					<div className="mb-4 h-2 w-full rounded-full bg-muted">
						<div
							className="h-2 rounded-full bg-primary transition-all duration-300"
							style={{ width: `${progress.overall}%` }}
						/>
					</div>

					{/* Category navigation dots */}
					<div className="flex justify-center space-x-2">
						{organizationCategories.map((category, index) => {
							const isNavigationAllowedToCategory = isNavigationAllowed(index);
							const isCurrentCategory = index === currentCategory;
							const isCategoryCompleted = checklist[category.checklistKey];

							return (
								<button
									key={category.category}
									onClick={() => handleCategoryChange(index)}
									disabled={!isNavigationAllowedToCategory}
									className={`h-3 w-5 rounded-full transition-all duration-200 ${
										isCurrentCategory
											? "bg-primary"
											: isCategoryCompleted
												? "bg-primary/70"
												: isNavigationAllowedToCategory
													? "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
													: "cursor-not-allowed bg-slate-200 opacity-50 dark:bg-slate-700"
									}`}
									title={
										isNavigationAllowedToCategory
											? category.category
											: `Complete previous sections to access ${category.category}`
									}
								/>
							);
						})}
					</div>
				</div>

				{/* Step Form */}
				<div className="w-full">
					<OrganizationStepForm
						currentCategory={currentCategory}
						direction={direction}
						categoryData={currentCategoryData}
						formData={formData}
						onInputChange={handleInputChange}
						onNext={handleNext}
						onBack={handleBack}
						onSubmit={handleSubmit}
						resetForm={resetForm}
						onKeyPress={handleKeyPress}
						isAllFieldsValid={areAllCategoryFieldsValid()}
						isCategoryCompleted={checklist[currentCategoryData.checklistKey]}
						isLastCategory={isLastCategory}
						showBackButton={currentCategory > 0}
						fieldErrors={fieldErrors}
						getFieldError={getFieldError}
						touchedFields={touchedFields}
					/>
				</div>
			</div>
		</div>
	);
}

export default RegisterOrgPage;
