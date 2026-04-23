import React, { useEffect, useState } from 'react';
import { getNames } from 'country-list';
import { useAlert } from '../context/AlertContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../src/index';

export default function Registration() {
    const navigate = useNavigate();
    const [role, setRole] = useState('admin');
    const { showAlert } = useAlert();
    const countries = getNames();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [sameAddress, setSameAddress] = useState(false);

    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        dob: '',
        email: '',
        mobile: '',
        cnic: '',
        blood_group: '',
        nationality: '',
        password: '',
        retype_password: '',
    });

    const [studentData, setStudentData] = useState({
        campus: 'P',
        program: 'CS',
        degree: 'BS',
        batch: '20',
        status: 'Active',
    });

    const [addressData, setAddressData] = useState({
        permanent: {
            address: '',
            city: '',
            province: '',
            country: '',
            postal_code: '',
        },
        current: {
            address: '',
            city: '',
            province: '',
            country: '',
            postal_code: '',
        },
    });

    const genderOptions = [
        { value: "M", label: "Male" },
        { value: "F", label: "Female" },
        { value: "T", label: "Transgender" }
    ];

    const bloodGroupOptions = [
        { value: "O+", label: "O+" },
        { value: "O-", label: "O-" },
        { value: "A+", label: "A+" },
        { value: "A-", label: "A-" },
        { value: "B+", label: "B+" },
        { value: "B-", label: "B-" },
        { value: "AB+", label: "AB+" },
        { value: "AB-", label: "AB-" }
    ];

    const campusOptions = [
        { value: "P", label: "Peshawar" },
        { value: "I", label: "Islamabad" },
        { value: "K", label: "Karachi" },
        { value: "L", label: "Lahore" },
        { value: "M", label: "Multan" },
        { value: "F", label: "Faisalabad" }
    ];

    const programOptions = [
        { value: "AI", label: "Artificial Intelligence" },
        { value: "CS", label: "Computer Science" },
        { value: "SE", label: "Software Engineering" },
        { value: "CE", label: "Computer Engineering" }
    ];

    const degreeOptions = [
        { value: "BS", label: "Bachelor of Science" },
        { value: "MS", label: "Master of Science" },
        { value: "PHD", label: "Doctor of Philosophy" }
    ];

    const formatMobile = (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 5) return digits;
        return `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
    };

    const formatCNIC = (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 6) return digits;
        if (digits.length < 13)
            return `${digits.slice(0, 5)}-${digits.slice(5, 12)}`;
        return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'mobile') {
            formattedValue = formatMobile(value);
        }
        if (name === 'cnic') {
            formattedValue = formatCNIC(value);
        }

        setUserData((prev) => ({
            ...prev,
            [name]: formattedValue
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleStudentChange = (e) => {
        const { name, value } = e.target;
        setStudentData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddressChange = (type, e) => {
        const { name, value } = e.target;
        setAddressData((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [name]: value
            }
        }));

        // If "same address" is checked, update current address too
        if (type === 'permanent' && sameAddress) {
            setAddressData((prev) => ({
                ...prev,
                current: {
                    ...prev.current,
                    [name]: value
                }
            }));
        }

        if (errors[`${type}_${name}`]) {
            setErrors((prev) => ({ ...prev, [`${type}_${name}`]: '' }));
        }
    };

    const handleSameAddressChange = (e) => {
        const checked = e.target.checked;
        setSameAddress(checked);

        if (checked) {
            // Copy permanent address to current address
            setAddressData((prev) => ({
                ...prev,
                current: { ...prev.permanent }
            }));
        } else {
            // Clear current address
            setAddressData((prev) => ({
                ...prev,
                current: {
                    address: '',
                    city: '',
                    province: '',
                    country: '',
                    postal_code: '',
                }
            }));
        }
    };

    const handleBatchChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');

        // Always keep "20" at start
        if (!value.startsWith('20')) {
            value = '20';
        }

        // Limit to 4 digits
        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        setStudentData((prev) => ({ ...prev, batch: value }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        const isAddressStep = (role === 'admin' && step === 2) || (role === 'student' && step === 3);

        if (step === 1) {
            // Basic Information validation
            if (!userData.first_name) newErrors.first_name = 'First Name is Required';
            if (!userData.last_name) newErrors.last_name = 'Last Name is Required';
            if (!userData.gender) newErrors.gender = 'Gender is Required';
            if (!userData.dob) newErrors.dob = 'Date of Birth is Required';
            if (!userData.email) newErrors.email = 'Email is Required';
            if (!userData.mobile) newErrors.mobile = 'Mobile is required';
            if (!userData.cnic) newErrors.cnic = 'CNIC is required';
            if (!userData.nationality) newErrors.nationality = 'Nationality is required';
            if (!userData.blood_group) newErrors.blood_group = 'Blood Group is required';
            if (!userData.password) newErrors.password = 'Password is required';
            if (!userData.retype_password) {
                newErrors.retype_password = 'Retype Password is required';
            } else if (userData.password !== userData.retype_password) {
                newErrors.retype_password = 'Passwords do not match';
            }
        } else if (step === 2 && role === 'student') {
            // Academic Information validation (Student only)
            if (!studentData.campus) newErrors.campus = 'Campus is required';
            if (!studentData.program) newErrors.program = 'Program is required';
            if (!studentData.degree) newErrors.degree = 'Degree is required';
            if (!studentData.batch || studentData.batch.length !== 4) newErrors.batch = 'Valid Batch year is required (e.g., 2024)';
        } else if (isAddressStep) {
            // Address validation
            if (!addressData.permanent.address) newErrors.permanent_address = 'Permanent Address is required';
            if (!addressData.permanent.city) newErrors.permanent_city = 'Permanent City is required';
            if (!addressData.permanent.province) newErrors.permanent_province = 'Permanent Province is required';
            if (!addressData.permanent.country) newErrors.permanent_country = 'Permanent Country is required';
            if (!addressData.permanent.postal_code) newErrors.permanent_postal_code = 'Permanent Postal Code is required';

            if (!sameAddress) {
                if (!addressData.current.address) newErrors.current_address = 'Current Address is required';
                if (!addressData.current.city) newErrors.current_city = 'Current City is required';
                if (!addressData.current.province) newErrors.current_province = 'Current Province is required';
                if (!addressData.current.country) newErrors.current_country = 'Current Country is required';
                if (!addressData.current.postal_code) newErrors.current_postal_code = 'Current Postal Code is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    useEffect(() => {
        console.log(role)
    }, [role])
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1);
        setErrors({});
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setCurrentStep(1);
        setErrors({});
    };

    const getTotalSteps = () => {
        return role === 'admin' ? 2 : 3;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        setLoading(true);

        const mobile = userData.mobile.replace(/\D/g, '').replace(/^(\d{4})(\d{7})$/, '$1-$2');
        const cnic = userData.cnic.replace(/\D/g, '').replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3');

        const payload = {
            ...userData,
            mobile,
            cnic,
        };

        // Remove retype_password as it's not needed in backend
        delete payload.retype_password;

        // Add student data if role is student
        if (role === 'student') {
            payload.student = {
                campus: studentData.campus,
                program: studentData.program,
                degree: studentData.degree,
                batch: studentData.batch,
            };
        }

        // Add addresses
        payload.addresses = [
            {
                address_type: 'Permanent',
                ...addressData.permanent
            },
        ];
        if (!sameAddress) {
            payload.addresses.push({
                address_type: 'Current',
                ...addressData.current
            });
        }

        try {
            const { data } = await api.post(`/users/`, payload);

            showAlert(`${role === 'admin' ? 'Admin' : 'Student'} Registered Successfully!`, 'success', 5000);
            showAlert(`Those are your login credentials(Remember them): Username: ${data.username}, Password: ${data.password}`, 'info', 10000);

            // Reset all form data
            setUserData({
                first_name: '',
                last_name: '',
                gender: '',
                dob: '',
                email: '',
                mobile: '',
                cnic: '',
                blood_group: '',
                nationality: '',
                password: '',
                retype_password: '',
            });

            setStudentData({
                campus: 'P',
                program: 'CS',
                degree: 'BS',
                batch: '20',
            });

            setAddressData({
                permanent: {
                    address: '',
                    city: '',
                    province: '',
                    country: '',
                    postal_code: '',
                },
                current: {
                    address: '',
                    city: '',
                    province: '',
                    country: '',
                    postal_code: '',
                },
            });

            setCurrentStep(1);
            setSameAddress(false);

        } catch (err) {
            const errData = err.response?.data;
            console.log('Registration error:', errData);
            // Show first field error if available
            const firstError = errData && typeof errData === 'object'
                ? Object.entries(errData).map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`).join(', ')
                : 'Registration Failed';
            showAlert(firstError, 'error');
            setLoading(false);
        }
    };

    /* ─── shared dark-theme classes ─── */
    const inputCls = (err) =>
        `w-full px-3 py-2 rounded-lg text-sm outline-none transition-all text-white placeholder-slate-500 ${err
            ? 'border border-red-500 ring-1 ring-red-500/40'
            : 'border border-[rgba(139,92,246,0.22)] focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40'
        }`;
    const inputStyle = { background: 'rgba(124,58,237,0.07)' };
    const labelCls = 'block text-xs font-semibold mb-1 text-slate-400 uppercase tracking-wide';

    const renderStepIndicator = () => {
        const totalSteps = getTotalSteps();
        return (
            <div className="flex items-center justify-center mb-6">
                {[...Array(totalSteps)].map((_, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${currentStep > index + 1
                                    ? 'bg-emerald-500 text-white'
                                    : currentStep === index + 1
                                        ? 'text-white'
                                        : 'text-slate-500'
                                    }`}
                                style={
                                    currentStep === index + 1
                                        ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.40)' }
                                        : currentStep <= index + 1
                                            ? { background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.22)' }
                                            : {}
                                }
                            >
                                {currentStep > index + 1 ? '✓' : index + 1}
                            </div>
                            <span className="text-[10px] mt-1 text-slate-500 font-medium">
                                {index === 0 ? 'Basic' : index === 1 ? (role === 'admin' ? 'Address' : 'Academic') : 'Address'}
                            </span>
                        </div>
                        {index < totalSteps - 1 && (
                            <div className={`w-14 h-0.5 mx-2 mb-4 ${currentStep > index + 1 ? 'bg-emerald-500' : 'bg-[rgba(139,92,246,0.20)]'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const renderStep1 = () => (
        <>
            <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>First Name</label>
                    <input type="text" name="first_name" placeholder="First Name" value={userData.first_name} onChange={handleUserChange} className={inputCls(errors.first_name)} style={inputStyle} />
                    {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
                </div>
                <div>
                    <label className={labelCls}>Last Name</label>
                    <input type="text" name="last_name" placeholder="Last Name" value={userData.last_name} onChange={handleUserChange} className={inputCls(errors.last_name)} style={inputStyle} />
                    {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Password</label>
                    <input type="password" name="password" placeholder="••••••••" value={userData.password} onChange={handleUserChange} className={inputCls(errors.password)} style={inputStyle} />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                    <label className={labelCls}>Retype Password</label>
                    <input type="password" name="retype_password" placeholder="••••••••" value={userData.retype_password} onChange={handleUserChange} className={inputCls(errors.retype_password)} style={inputStyle} />
                    {errors.retype_password && <p className="text-red-400 text-xs mt-1">{errors.retype_password}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Gender</label>
                    <select name="gender" value={userData.gender} onChange={handleUserChange} className={inputCls(errors.gender)} style={inputStyle}>
                        <option value="" style={{ background: '#0d0b18' }}>Select Gender</option>
                        {genderOptions.map((g) => <option key={g.value} value={g.value} style={{ background: '#0d0b18' }}>{g.label}</option>)}
                    </select>
                    {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                </div>
                <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input type="date" name="dob" value={userData.dob} onChange={handleUserChange} className={inputCls(errors.dob)} style={{ ...inputStyle, colorScheme: 'dark' }} />
                    {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" name="email" placeholder="user@gmail.com" value={userData.email} onChange={handleUserChange} className={inputCls(errors.email)} style={inputStyle} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className={labelCls}>Mobile</label>
                    <input type="text" name="mobile" placeholder="0300-1234567" value={userData.mobile} onChange={handleUserChange} className={inputCls(errors.mobile)} style={inputStyle} />
                    {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>CNIC</label>
                    <input type="text" name="cnic" placeholder="12345-1234567-1" value={userData.cnic} onChange={handleUserChange} className={inputCls(errors.cnic)} style={inputStyle} />
                    {errors.cnic && <p className="text-red-400 text-xs mt-1">{errors.cnic}</p>}
                </div>
                <div>
                    <label className={labelCls}>Blood Group</label>
                    <select name="blood_group" value={userData.blood_group} onChange={handleUserChange} className={inputCls(errors.blood_group)} style={inputStyle}>
                        <option value="" style={{ background: '#0d0b18' }}>Select Blood Group</option>
                        {bloodGroupOptions.map((bg) => <option key={bg.value} value={bg.value} style={{ background: '#0d0b18' }}>{bg.label}</option>)}
                    </select>
                    {errors.blood_group && <p className="text-red-400 text-xs mt-1">{errors.blood_group}</p>}
                </div>
            </div>
            <div>
                <label className={labelCls}>Nationality</label>
                <select name="nationality" value={userData.nationality} onChange={handleUserChange} className={inputCls(errors.nationality)} style={inputStyle}>
                    <option value="" style={{ background: '#0d0b18' }}>Select Country</option>
                    {countries.map((c) => <option key={c} value={c} style={{ background: '#0d0b18' }}>{c}</option>)}
                </select>
                {errors.nationality && <p className="text-red-400 text-xs mt-1">{errors.nationality}</p>}
            </div>
        </>
    );

    const renderStep2Student = () => (
        <>
            <h2 className="text-lg font-bold text-white mb-4">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Campus</label>
                    <select name="campus" value={studentData.campus} onChange={handleStudentChange} className={inputCls(errors.campus)} style={inputStyle}>
                        {campusOptions.map((c) => <option key={c.value} value={c.value} style={{ background: '#0d0b18' }}>{c.label}</option>)}
                    </select>
                    {errors.campus && <p className="text-red-400 text-xs mt-1">{errors.campus}</p>}
                </div>
                <div>
                    <label className={labelCls}>Program</label>
                    <select name="program" value={studentData.program} onChange={handleStudentChange} className={inputCls(errors.program)} style={inputStyle}>
                        {programOptions.map((p) => <option key={p.value} value={p.value} style={{ background: '#0d0b18' }}>{p.label}</option>)}
                    </select>
                    {errors.program && <p className="text-red-400 text-xs mt-1">{errors.program}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Degree</label>
                    <select name="degree" value={studentData.degree} onChange={handleStudentChange} className={inputCls(errors.degree)} style={inputStyle}>
                        {degreeOptions.map((d) => <option key={d.value} value={d.value} style={{ background: '#0d0b18' }}>{d.label}</option>)}
                    </select>
                    {errors.degree && <p className="text-red-400 text-xs mt-1">{errors.degree}</p>}
                </div>
                <div>
                    <label className={labelCls}>Batch</label>
                    <input type="text" name="batch" value={studentData.batch} onChange={handleBatchChange} maxLength={4} placeholder="2024" className={inputCls(errors.batch)} style={inputStyle} />
                    {errors.batch && <p className="text-red-400 text-xs mt-1">{errors.batch}</p>}
                </div>
            </div>
            <div className="p-3 rounded-lg text-sm text-violet-300" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.22)' }}>
                <strong>Note:</strong> Your Roll Number will be generated automatically based on your campus and batch.
            </div>
        </>
    );

    const AddrField = ({ label, name, value, onChange, error, type = 'text', rows }) => (
        <div>
            <label className={labelCls}>{label}</label>
            {rows ? (
                <textarea name={name} value={value} onChange={onChange} rows={rows} placeholder={label} className={inputCls(error)} style={inputStyle} />
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} placeholder={label} className={inputCls(error)} style={inputStyle} />
            )}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );

    const renderAddressStep = () => (
        <>
            <h2 className="text-lg font-bold text-white mb-4">Address Information</h2>
            <div className="mb-5 p-4 rounded-xl space-y-3" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(139,92,246,0.16)' }}>
                <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-wide">Permanent Address</h3>
                <AddrField label="Street Address" name="address" value={addressData.permanent.address} onChange={(e) => handleAddressChange('permanent', e)} error={errors.permanent_address} rows={2} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AddrField label="City" name="city" value={addressData.permanent.city} onChange={(e) => handleAddressChange('permanent', e)} error={errors.permanent_city} />
                    <AddrField label="Province" name="province" value={addressData.permanent.province} onChange={(e) => handleAddressChange('permanent', e)} error={errors.permanent_province} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AddrField label="Country" name="country" value={addressData.permanent.country} onChange={(e) => handleAddressChange('permanent', e)} error={errors.permanent_country} />
                    <AddrField label="Postal Code" name="postal_code" value={addressData.permanent.postal_code} onChange={(e) => handleAddressChange('permanent', e)} error={errors.permanent_postal_code} />
                </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" checked={sameAddress} onChange={handleSameAddressChange} className="w-4 h-4 accent-violet-500" />
                <span className="text-sm text-slate-400">Current address is same as permanent address</span>
            </label>

            {!sameAddress && (
                <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(139,92,246,0.16)' }}>
                    <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-wide">Current Address</h3>
                    <AddrField label="Street Address" name="address" value={addressData.current.address} onChange={(e) => handleAddressChange('current', e)} error={errors.current_address} rows={2} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AddrField label="City" name="city" value={addressData.current.city} onChange={(e) => handleAddressChange('current', e)} error={errors.current_city} />
                        <AddrField label="Province" name="province" value={addressData.current.province} onChange={(e) => handleAddressChange('current', e)} error={errors.current_province} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AddrField label="Country" name="country" value={addressData.current.country} onChange={(e) => handleAddressChange('current', e)} error={errors.current_country} />
                        <AddrField label="Postal Code" name="postal_code" value={addressData.current.postal_code} onChange={(e) => handleAddressChange('current', e)} error={errors.current_postal_code} />
                    </div>
                </div>
            )}
        </>
    );

    return (
        <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--page-bg, #000)' }}>
            <div className="max-w-3xl mx-auto">
                {/* Ambient glow blob */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />

                <div className="relative rounded-2xl p-6 md:p-8 space-y-6" style={{ background: 'rgba(13,11,24,0.88)', border: '1px solid rgba(139,92,246,0.18)', backdropFilter: 'blur(24px)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <button onClick={() => navigate('/admin')} className="p-1.5 rounded-lg transition-colors" style={{ color: 'rgba(196,181,253,0.7)' }} title="Back to Admin">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Registration Form</h1>
                            <p className="text-sm text-slate-500">Create a new user account</p>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="flex gap-3">
                        {['admin', 'student'].map((r) => (
                            <label key={r} className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all" style={role === r ? { background: 'rgba(124,58,237,0.20)', border: '1px solid rgba(139,92,246,0.40)', color: '#c4b5fd' } : { background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(139,92,246,0.14)', color: '#64748b' }}>
                                <input type="radio" name="role" checked={role === r} onChange={() => handleRoleChange(r)} className="accent-violet-500" />
                                <span className="text-sm font-semibold capitalize">{r}</span>
                            </label>
                        ))}
                    </div>

                    {/* Step Indicator */}
                    {renderStepIndicator()}

                    {/* Form Steps */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && role === 'student' && renderStep2Student()}
                        {((currentStep === 2 && role === 'admin') || (currentStep === 3 && role === 'student')) && renderAddressStep()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between gap-3 pt-4" style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }}>
                            {currentStep > 1 && (
                                <button type="button" onClick={handlePrevious} className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-400 transition-colors" style={{ border: '1px solid rgba(139,92,246,0.22)', background: 'rgba(124,58,237,0.07)' }}>
                                    ← Previous
                                </button>
                            )}
                            {currentStep < getTotalSteps() ? (
                                <button type="button" onClick={handleNext} className="ml-auto px-5 py-2 rounded-lg text-sm font-bold text-white transition-all" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.35)' }}>
                                    Next →
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className="ml-auto px-5 py-2 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 0 20px rgba(5,150,105,0.30)' }}>
                                    {loading ? 'Submitting…' : '✓ Submit'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
