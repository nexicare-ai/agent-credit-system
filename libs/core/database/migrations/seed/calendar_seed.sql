-- SQL to insert sample appointments
DELETE FROM conversation_state_appointment;
-- SQL to insert sample appointments

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT716P7G521ZE5DB9WJCV', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-03-29', '14:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 1', 'confirmed',
    '2025-03-29 21:00:16.294930', '2025-03-29 21:00:16.294934',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT716VHF4Q6TXBAQ69N5K', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-30', '17:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 2', 'requested',
    '2025-03-29 21:00:16.294970', '2025-03-29 21:00:16.294971',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT716Z0E5SM4PXJ2RNX11', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-04-01', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 3', 'requested',
    '2025-03-29 21:00:16.295010', '2025-03-29 21:00:16.295011',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717QVWRM0ZWE6MWQ5HP', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-30', '10:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 4', 'confirmed',
    '2025-03-29 21:00:16.295044', '2025-03-29 21:00:16.295045',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7176AYB3EC9FCN65R6N', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-03-29', '17:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 5', 'confirmed',
    '2025-03-29 21:00:16.295070', '2025-03-29 21:00:16.295071',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717MF4A6EYNGCR06CKD', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-03-31', '11:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 6', 'requested',
    '2025-03-29 21:00:16.295095', '2025-03-29 21:00:16.295095',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717PZ2XGEQB9WW57PKA', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-04-03', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 7', 'requested',
    '2025-03-29 21:00:16.295124', '2025-03-29 21:00:16.295124',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7176SRRZP7NPA5VQRS7', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-04-02', '14:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 8', 'requested',
    '2025-03-29 21:00:16.295158', '2025-03-29 21:00:16.295159',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7172MP08E9Q3CV1H9F1', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-03', '15:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 9', 'requested',
    '2025-03-29 21:00:16.295184', '2025-03-29 21:00:16.295184',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717681P47RZXBYR24R9', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-03-30', '14:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 10', 'confirmed',
    '2025-03-29 21:00:16.295207', '2025-03-29 21:00:16.295207',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717F3RCX17XG76ZWMXR', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-03-30', '10:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 11', 'requested',
    '2025-03-29 21:00:16.295229', '2025-03-29 21:00:16.295229',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717PSKJM9AHWZYDPMDS', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-29', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 12', 'confirmed',
    '2025-03-29 21:00:16.295251', '2025-03-29 21:00:16.295251',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT71750G3TGDCRZ854ZHR', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-04-01', '11:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 13', 'requested',
    '2025-03-29 21:00:16.295274', '2025-03-29 21:00:16.295274',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717N53QC9AMA1RFC3T0', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-04-03', '11:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 14', 'requested',
    '2025-03-29 21:00:16.295295', '2025-03-29 21:00:16.295296',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717M57MC89TXF187CHH', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-04-03', '09:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 15', 'confirmed',
    '2025-03-29 21:00:16.295317', '2025-03-29 21:00:16.295317',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717XY8AJ35KEXH0CBS9', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-03-31', '11:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 16', 'requested',
    '2025-03-29 21:00:16.295338', '2025-03-29 21:00:16.295338',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717VQZ01PXSV0D23KZW', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-04-02', '10:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 17', 'requested',
    '2025-03-29 21:00:16.295357', '2025-03-29 21:00:16.295357',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7173JAHC4MDD34EVEXV', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-04-01', '14:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 18', 'confirmed',
    '2025-03-29 21:00:16.295375', '2025-03-29 21:00:16.295376',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717BRPH610GA77P3GPZ', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-04-01', '14:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 19', 'requested',
    '2025-03-29 21:00:16.295394', '2025-03-29 21:00:16.295394',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717QKEYAJCPHN2FXR5Z', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-03-30', '17:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 20', 'requested',
    '2025-03-29 21:00:16.295418', '2025-03-29 21:00:16.295419',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717G01D7VT873JHMFYY', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-04-03', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 21', 'requested',
    '2025-03-29 21:00:16.295436', '2025-03-29 21:00:16.295441',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717A4ECSCXRCZKK62G2', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-03-30', '17:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 22', 'requested',
    '2025-03-29 21:00:16.295463', '2025-03-29 21:00:16.295463',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717X3FH6D71QZKJSJ6P', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-03-30', '16:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 23', 'confirmed',
    '2025-03-29 21:00:16.295482', '2025-03-29 21:00:16.295482',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717A4R3E1ZHXC4ZN01G', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-31', '17:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 24', 'requested',
    '2025-03-29 21:00:16.295501', '2025-03-29 21:00:16.295501',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717Z5XSA0B5GQX9ZTDB', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-29', '10:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 25', 'requested',
    '2025-03-29 21:00:16.295521', '2025-03-29 21:00:16.295521',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7178E7XQD58EKFVSSK8', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-03-31', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 26', 'confirmed',
    '2025-03-29 21:00:16.295540', '2025-03-29 21:00:16.295540',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7170639F93TNTZKFZ5G', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-03-30', '16:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 27', 'requested',
    '2025-03-29 21:00:16.295558', '2025-03-29 21:00:16.295558',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717W2NAZJAQF43D9J3Z', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-04-03', '10:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 28', 'confirmed',
    '2025-03-29 21:00:16.295577', '2025-03-29 21:00:16.295577',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717E3BWTETH930BAY5X', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-04-03', '15:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 29', 'confirmed',
    '2025-03-29 21:00:16.295596', '2025-03-29 21:00:16.295597',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7174XM3NDGY2349DHVA', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-31', '11:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 30', 'requested',
    '2025-03-29 21:00:16.295615', '2025-03-29 21:00:16.295615',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717NVEF6T4288EGM6P5', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-30', '16:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 31', 'confirmed',
    '2025-03-29 21:00:16.295633', '2025-03-29 21:00:16.295634',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7174N1HMTWG5X8TAPNH', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-03', '14:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 32', 'confirmed',
    '2025-03-29 21:00:16.295652', '2025-03-29 21:00:16.295652',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7173ZT9DNFQG7BPZCV3', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-04-03', '09:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 33', 'requested',
    '2025-03-29 21:00:16.295670', '2025-03-29 21:00:16.295671',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717VC8ZCW6BSYGSQ91T', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-04-02', '16:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 34', 'confirmed',
    '2025-03-29 21:00:16.295689', '2025-03-29 21:00:16.295690',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717R6TSFE3V98FBKJBT', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-03-29', '16:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 35', 'requested',
    '2025-03-29 21:00:16.295708', '2025-03-29 21:00:16.295708',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT71790YPAYKJBTJZMA7B', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-29', '11:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 36', 'confirmed',
    '2025-03-29 21:00:16.295726', '2025-03-29 21:00:16.295727',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717ACCVFEFCRAEG6Q65', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-03-31', '16:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 37', 'requested',
    '2025-03-29 21:00:16.295745', '2025-03-29 21:00:16.295745',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717SV28C7TYSVNW7H6R', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-29', '17:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 38', 'confirmed',
    '2025-03-29 21:00:16.295763', '2025-03-29 21:00:16.295764',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717VZPA8N9Z7AFNY529', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-03', '17:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 39', 'requested',
    '2025-03-29 21:00:16.295829', '2025-03-29 21:00:16.295830',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717VFVEFAB8KTDDEFVQ', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-03-30', '16:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 40', 'confirmed',
    '2025-03-29 21:00:16.295848', '2025-03-29 21:00:16.295849',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717STGQXHVBCSYD2187', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-03-30', '16:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 41', 'confirmed',
    '2025-03-29 21:00:16.295866', '2025-03-29 21:00:16.295867',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717MM58Q14ZR00VZEGA', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-03-30', '15:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 42', 'requested',
    '2025-03-29 21:00:16.295885', '2025-03-29 21:00:16.295885',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT71743XPHZBYFKS90YMS', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-04-01', '10:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 43', 'confirmed',
    '2025-03-29 21:00:16.295903', '2025-03-29 21:00:16.295903',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717TT91GD5WY9E5FNVJ', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-04-02', '11:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 44', 'requested',
    '2025-03-29 21:00:16.295923', '2025-03-29 21:00:16.295923',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT717Z7FD61421NFD9SJE', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-04-01', '11:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 45', 'confirmed',
    '2025-03-29 21:00:16.295943', '2025-03-29 21:00:16.295943',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7177H340SQHKCZT2FG2', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-02', '14:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 46', 'confirmed',
    '2025-03-29 21:00:16.295963', '2025-03-29 21:00:16.295964',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT71746308390F3DY19QB', 'test::CLID0000::+85297870823', 'CLID0000',
    '林小姐', '2025-03-29', '17:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 47', 'confirmed',
    '2025-03-29 21:00:16.295985', '2025-03-29 21:00:16.295986',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7178Z29MRKAR8CS2AT5', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-04-01', '17:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 48', 'confirmed',
    '2025-03-29 21:00:16.296006', '2025-03-29 21:00:16.296006',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718A8T7TMY82JW9AW2B', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-03-31', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 49', 'confirmed',
    '2025-03-29 21:00:16.296026', '2025-03-29 21:00:16.296026',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7185Q3VDQQ5565KYZ3W', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-04-01', '16:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 50', 'requested',
    '2025-03-29 21:00:16.296046', '2025-03-29 21:00:16.296047',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718TETNYWDADVJGFM61', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-03-29', '15:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 51', 'requested',
    '2025-03-29 21:00:16.296066', '2025-03-29 21:00:16.296067',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718A0NQ6AAFJRY6CX0N', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-29', '11:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 52', 'confirmed',
    '2025-03-29 21:00:16.296087', '2025-03-29 21:00:16.296087',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7186CGEXZE5GNHCNQNH', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-03-31', '11:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 53', 'requested',
    '2025-03-29 21:00:16.296107', '2025-03-29 21:00:16.296108',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718S1J5YZT0J8JCAN1T', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-29', '15:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 54', 'requested',
    '2025-03-29 21:00:16.296128', '2025-03-29 21:00:16.296128',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718F58JE56BN4DQHYTK', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-04-03', '15:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 55', 'confirmed',
    '2025-03-29 21:00:16.296148', '2025-03-29 21:00:16.296149',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718JE2H50KD7BMB8DDR', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-02', '10:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 56', 'confirmed',
    '2025-03-29 21:00:16.296168', '2025-03-29 21:00:16.296169',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7185ZV8YKTKM3YEXXDR', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-30', '15:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 57', 'confirmed',
    '2025-03-29 21:00:16.296187', '2025-03-29 21:00:16.296187',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT71861RYWP9XADN084X1', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-03-29', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 58', 'requested',
    '2025-03-29 21:00:16.296205', '2025-03-29 21:00:16.296205',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718TW10ME873DX8P3G2', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-04-03', '09:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 59', 'requested',
    '2025-03-29 21:00:16.296223', '2025-03-29 21:00:16.296224',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718FM4KX9ST5N0F6358', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-04-02', '17:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 60', 'confirmed',
    '2025-03-29 21:00:16.296241', '2025-03-29 21:00:16.296242',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718VGFYS40GX4HWM51F', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-03-29', '09:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 61', 'requested',
    '2025-03-29 21:00:16.296260', '2025-03-29 21:00:16.296260',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718MGTG9CYB59D24ZRZ', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-03-29', '09:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 62', 'confirmed',
    '2025-03-29 21:00:16.296278', '2025-03-29 21:00:16.296278',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7184917Y1SQC2CCTFYY', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-03-29', '15:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 63', 'requested',
    '2025-03-29 21:00:16.296296', '2025-03-29 21:00:16.296297',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718ZTYP2RJP7PJYTQK6', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-03-30', '14:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 64', 'requested',
    '2025-03-29 21:00:16.296316', '2025-03-29 21:00:16.296316',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718Q0EWDY1XS10PMATS', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-04-01', '16:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 65', 'confirmed',
    '2025-03-29 21:00:16.296339', '2025-03-29 21:00:16.296340',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718K6FH37GD79ZDH6CX', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-03-29', '15:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 66', 'requested',
    '2025-03-29 21:00:16.296358', '2025-03-29 21:00:16.296359',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718DQDNQ8JQN02D2453', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-04-03', '17:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 67', 'confirmed',
    '2025-03-29 21:00:16.296377', '2025-03-29 21:00:16.296378',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7189RHQXBB825JSM7H0', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-30', '14:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 68', 'confirmed',
    '2025-03-29 21:00:16.296396', '2025-03-29 21:00:16.296396',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718CCH4EVTKVNH6NTTT', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-03-31', '15:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 69', 'requested',
    '2025-03-29 21:00:16.296414', '2025-03-29 21:00:16.296415',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7185X1YPBTRAX56JKE8', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-04-03', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 70', 'requested',
    '2025-03-29 21:00:16.296435', '2025-03-29 21:00:16.296435',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718XT3R0JJC3YEQ61WN', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-03-31', '14:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 71', 'requested',
    '2025-03-29 21:00:16.296455', '2025-03-29 21:00:16.296456',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718VAQXPW1KJDT7ZEK1', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-04-03', '15:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 72', 'requested',
    '2025-03-29 21:00:16.296479', '2025-03-29 21:00:16.296479',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718EB9RQS0QB0CVVW78', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-03', '14:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 73', 'confirmed',
    '2025-03-29 21:00:16.296499', '2025-03-29 21:00:16.296500',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718FRKGQ24T054Q655N', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-04-02', '09:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 74', 'requested',
    '2025-03-29 21:00:16.296520', '2025-03-29 21:00:16.296520',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7183Q2D4H1ZB6K1TQVE', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-03-31', '16:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 75', 'requested',
    '2025-03-29 21:00:16.296540', '2025-03-29 21:00:16.296540',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718WMVZTADHBJW9CCKR', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-03-31', '14:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 76', 'requested',
    '2025-03-29 21:00:16.296560', '2025-03-29 21:00:16.296561',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718G2KGN7KH11XDNN9M', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-04-02', '16:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 77', 'requested',
    '2025-03-29 21:00:16.296581', '2025-03-29 21:00:16.296582',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718QGFGF7R80CZ3D228', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-29', '09:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 78', 'requested',
    '2025-03-29 21:00:16.296602', '2025-03-29 21:00:16.296602',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718CZQW6F4G6ECQ32BS', 'test::CLID0000::+85297870823', 'CLID0000',
    '王小姐', '2025-04-01', '16:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 79', 'requested',
    '2025-03-29 21:00:16.296622', '2025-03-29 21:00:16.296623',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7182EZG0960Z9SM8GJK', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-29', '16:15',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 80', 'requested',
    '2025-03-29 21:00:16.296643', '2025-03-29 21:00:16.296643',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7183J2K30YHN4X8P6VZ', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-04-02', '16:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 81', 'confirmed',
    '2025-03-29 21:00:16.296663', '2025-03-29 21:00:16.296664',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7185Y0MX2HFP25R93CS', 'test::CLID0000::+85297870823', 'CLID0000',
    '林小姐', '2025-03-29', '15:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 82', 'confirmed',
    '2025-03-29 21:00:16.296682', '2025-03-29 21:00:16.296683',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718GFXSKK4Y1DM0Q6HD', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-03-29', '16:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 83', 'confirmed',
    '2025-03-29 21:00:16.296702', '2025-03-29 21:00:16.296703',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718G1Z7FNHD0M170ESF', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-04-01', '17:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 84', 'requested',
    '2025-03-29 21:00:16.296721', '2025-03-29 21:00:16.296721',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718J3WSCYHVDQ7X47RT', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-03-31', '16:45',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 85', 'confirmed',
    '2025-03-29 21:00:16.296740', '2025-03-29 21:00:16.296740',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7186ZVFQHJ04Y8YQ33Q', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-03-30', '14:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 86', 'requested',
    '2025-03-29 21:00:16.296764', '2025-03-29 21:00:16.296764',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7185TJHYHKW078EGKAR', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-03-31', '14:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 87', 'requested',
    '2025-03-29 21:00:16.296787', '2025-03-29 21:00:16.296787',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7189Q7C1YD0C77ME4M8', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-03-31', '11:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 88', 'requested',
    '2025-03-29 21:00:16.296805', '2025-03-29 21:00:16.296806',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7181MKD3PE90WQ6HXMH', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-01', '17:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 89', 'requested',
    '2025-03-29 21:00:16.296823', '2025-03-29 21:00:16.296824',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718FX9VK7VARNJQWGEP', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-30', '11:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 90', 'confirmed',
    '2025-03-29 21:00:16.296841', '2025-03-29 21:00:16.296842',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718JGGZGFR5DQHWAKHD', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-03-29', '17:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 91', 'confirmed',
    '2025-03-29 21:00:16.296866', '2025-03-29 21:00:16.296867',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718M6GBAQME37QX7JP8', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-03-29', '09:30',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 92', 'confirmed',
    '2025-03-29 21:00:16.296886', '2025-03-29 21:00:16.296886',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718NG08KG1A26K1G8PF', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-04-03', '15:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 93', 'requested',
    '2025-03-29 21:00:16.296904', '2025-03-29 21:00:16.296905',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718FGPMNCA5PNGX0PES', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-03-30', '16:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 94', 'requested',
    '2025-03-29 21:00:16.296923', '2025-03-29 21:00:16.296923',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718PSGPXNCJA4NR0081', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-02', '16:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 95', 'confirmed',
    '2025-03-29 21:00:16.296942', '2025-03-29 21:00:16.296942',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718739PCXM854Z009PE', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-03-30', '10:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 96', 'requested',
    '2025-03-29 21:00:16.296961', '2025-03-29 21:00:16.296961',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718CH8M3098MK8PC0KE', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-04-01', '10:45',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 97', 'requested',
    '2025-03-29 21:00:16.296981', '2025-03-29 21:00:16.296981',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT718X28VWPXFSC43DNN2', 'test::CLID0000::+85297870823', 'CLID0000',
    '林小姐', '2025-04-02', '15:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Sample appointment 98', 'requested',
    '2025-03-29 21:00:16.297000', '2025-03-29 21:00:16.297000',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719Q11CGVFXAME2WVB1', 'test::CLID0000::+85297870823', 'CLID0000',
    '張先生', '2025-03-29', '09:15',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 99', 'confirmed',
    '2025-03-29 21:00:16.297019', '2025-03-29 21:00:16.297019',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719ESJPCZF8BJ3G6K1S', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-04-01', '15:30',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Sample appointment 100', 'confirmed',
    '2025-03-29 21:00:16.297038', '2025-03-29 21:00:16.297039',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719T3VV7R0V0M6CA8W0', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-03-29', '11:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 陳文浩醫生', 'confirmed',
    '2025-03-29 21:00:16.297060', '2025-03-29 21:00:16.297061',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT71953BKJ8NY90VCQ2VQ', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-03-29', '11:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 李心怡醫生', 'requested',
    '2025-03-29 21:00:16.297081', '2025-03-29 21:00:16.297081',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7194CP5MYDK5QAX49K9', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-03-30', '11:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 陳文浩醫生', 'confirmed',
    '2025-03-29 21:00:16.297102', '2025-03-29 21:00:16.297102',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719VQNXA5SZQ3K9WAN2', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-03-30', '11:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 李心怡醫生', 'confirmed',
    '2025-03-29 21:00:16.297122', '2025-03-29 21:00:16.297122',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719KHVFNK4FGMT31MJQ', 'test::CLID0000::+85297870823', 'CLID0000',
    '黃先生', '2025-03-31', '11:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 陳文浩醫生', 'confirmed',
    '2025-03-29 21:00:16.297143', '2025-03-29 21:00:16.297143',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT7190JMSGCE00JR4P1DX', 'test::CLID0000::+85297870823', 'CLID0000',
    '孫先生', '2025-03-31', '11:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 李心怡醫生', 'confirmed',
    '2025-03-29 21:00:16.297163', '2025-03-29 21:00:16.297163',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719KK5EC42DDHMNAR2Y', 'test::CLID0000::+85297870823', 'CLID0000',
    '趙小姐', '2025-04-01', '11:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 陳文浩醫生', 'confirmed',
    '2025-03-29 21:00:16.297182', '2025-03-29 21:00:16.297182',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719DKH44QZ4B2N1FQ6E', 'test::CLID0000::+85297870823', 'CLID0000',
    '周小姐', '2025-04-01', '11:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 李心怡醫生', 'requested',
    '2025-03-29 21:00:16.297200', '2025-03-29 21:00:16.297201',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719EF02TBM552MJGWY1', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-04-02', '11:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 陳文浩醫生', 'requested',
    '2025-03-29 21:00:16.297219', '2025-03-29 21:00:16.297219',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719VP6QG9AXA36739X4', 'test::CLID0000::+85297870823', 'CLID0000',
    '李小姐', '2025-04-02', '11:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 李心怡醫生', 'requested',
    '2025-03-29 21:00:16.297238', '2025-03-29 21:00:16.297238',
    true, true, 3
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719PN1YZ5EY4AZXH4R5', 'test::CLID0000::+85297870823', 'CLID0000',
    '伍先生', '2025-04-03', '11:00',
    15, 'Asia/Hong_Kong', '陳文浩醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 陳文浩醫生', 'confirmed',
    '2025-03-29 21:00:16.297256', '2025-03-29 21:00:16.297257',
    true, true, 2
);

INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '01JQGZT719QFZD9VNG12YBFJJA', 'test::CLID0000::+85297870823', 'CLID0000',
    '陳先生', '2025-04-03', '11:00',
    15, 'Asia/Hong_Kong', '李心怡醫生',
    'Demo Clinic', 'Daily 11:00 appointment for 李心怡醫生', 'confirmed',
    '2025-03-29 21:00:16.297276', '2025-03-29 21:00:16.297276',
    true, true, 3
);
