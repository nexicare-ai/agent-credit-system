import os
import sys
import random
from datetime import datetime, date, time, timedelta
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from typing import List, Tuple

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../')))

from libs.core.entities.conversation_state_appointment import ConversationStateAppointment
from libs.core.database import SessionLocal
import ulid

def generate_random_appointments(
    start_date: date,
    end_date: date,
    clid: str,
    doctor_ids: List[Tuple[str, int]],
    num_appointments: int
) -> List[ConversationStateAppointment]:
    """
    Generate random appointments for a date range
    """
    appointments = []

    # Generate random dates within the range
    delta = (end_date - start_date).days
    random_dates = [start_date + timedelta(days=random.randint(0, delta)) for _ in range(num_appointments)]

    # Common appointment times
    appointment_times = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "09:15", "09:45", "10:15", "10:45", "11:15", "11:45",
        "14:15", "14:45", "15:15", "15:45", "16:15", "16:45", "17:15",
        "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
        "14:45", "15:15", "15:45", "16:15", "16:45", "17:15", "17:45"
    ]

    # Sample customer names
    customer_names = [
        ("伍先生", "+85297870823"), ("李小姐", "+85297870823"), ("張先生", "+85297870823"), ("王小姐", "+85297870823"), ("陳先生", "+85297870823"),
        ("林小姐", "+85297870823"), ("黃先生", "+85297870823"), ("趙小姐", "+85297870823"), ("孫先生", "+85297870823"), ("周小姐", "+85297870823")
    ]

    # Sample clinic names
    clinic_names = [
        "Demo Clinic"
    ]

    # Generate appointments
    for i in range(num_appointments):
        appointment_date = random_dates[i]
        appointment_time = random.choice(appointment_times)
        (doctor_name, doctor_id) = random.choice(doctor_ids)
        (customer_name, customer_phone) = random.choice(customer_names)
        (clinic_name) = random.choice(clinic_names)

        appointment = ConversationStateAppointment(
            conversation_id=f"test::{clid}::{customer_phone}",
            clid=clid,
            customer_name=customer_name,
            appointment_date=appointment_date,
            appointment_start_time=appointment_time,
            duration_minutes=15,
            timezone="Asia/Hong_Kong",
            doctor_name=doctor_name,
            clinic_name=clinic_name,
            remarks=f"Sample appointment {i+1}",
            status=random.choice(["requested", "confirmed"]),
            is_active=True,
            has_notified=True
        )
        appointment.doctor_id = doctor_id
        appointments.append(appointment)

    # Ensure 11:00 appointment for each day in the date range
    for day_offset in range(delta + 1):
        current_date = start_date + timedelta(days=day_offset)
        for doctor_name, doctor_id in doctor_ids:
            customer_name, customer_phone = random.choice(customer_names)
            clinic_name = random.choice(clinic_names)

            appointment = ConversationStateAppointment(
                conversation_id=f"test::{clid}::{customer_phone}",
                clid=clid,
                customer_name=customer_name,
                appointment_date=current_date,
                appointment_start_time="11:00",
                duration_minutes=15,
                timezone="Asia/Hong_Kong",
                doctor_name=doctor_name,
                clinic_name=clinic_name,
                remarks=f"Daily 11:00 appointment for {doctor_name}",
                status=random.choice(["requested", "confirmed"]),
                is_active=True,
                has_notified=True
            )
            appointment.doctor_id = doctor_id
            appointments.append(appointment)

    return appointments

def generate_sql_for_appointments(appointments: List[ConversationStateAppointment]) -> str:
    """
    Generate SQL insert statements for the appointments
    """
    sql = "-- SQL to insert sample appointments\n"

    for appointment in appointments:
        sql += f"""
INSERT INTO conversation_state_appointment (
    id, conversation_id, clid, customer_name, appointment_date, appointment_start_time,
    duration_minutes, timezone, doctor_name, clinic_name, remarks, status,
    created_at, updated_at, has_notified, is_active, doctor_id
) VALUES (
    '{appointment.id}', '{appointment.conversation_id}', '{appointment.clid}',
    '{appointment.customer_name}', '{appointment.appointment_date}', '{appointment.appointment_start_time}',
    {appointment.duration_minutes}, '{appointment.timezone}', '{appointment.doctor_name}',
    '{appointment.clinic_name}', '{appointment.remarks}', '{appointment.status}',
    '{appointment.created_at}', '{appointment.updated_at}',
    {str(appointment.has_notified).lower()}, {str(appointment.is_active).lower()}, {appointment.doctor_id}
);
"""

    return sql

def fill_calendar():
    """
    Generate SQL for sample appointment data
    """
    try:
        # Define parameters for generating appointments
        start_date = date(2025, 3, 29)
        end_date = date(2025, 4, 3)
        # start_date = date.today() - timedelta(days=30)  # Start from 30 days ago
        # end_date = date.today() + timedelta(days=60)    # End 60 days in the future
        clid = "CLID0000"
        doctor_ids = [
            ("陳文浩醫生", 2),
            ("李心怡醫生", 3),
        ]  # Sample doctor IDs
        num_appointments = 100  # Number of appointments to generate

        # Generate random appointments
        appointments = generate_random_appointments(
            start_date=start_date,
            end_date=end_date,
            clid=clid,
            doctor_ids=doctor_ids,
            num_appointments=num_appointments
        )

        # Generate SQL for the appointments
        sql = generate_sql_for_appointments(appointments)

        # Write SQL to file
        output_file = "calendar_seed.sql"
        with open(output_file, "w") as f:
            f.write("-- SQL to insert sample appointments\n")
            f.write("DELETE FROM conversation_state_appointment;\n")
            f.write(sql)

        print(f"Successfully generated SQL for {num_appointments} sample appointments in {output_file}")

    except Exception as e:
        print(f"Error generating calendar SQL: {str(e)}")
        raise

if __name__ == "__main__":
    fill_calendar()
