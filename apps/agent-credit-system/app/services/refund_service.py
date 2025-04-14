from libs.core.entities.agent_event import AgentEvent
from libs.core.entities.agent_user import AgentUser
from decimal import Decimal

def refund_appointment(appointment_id, user_id, db, dry_run=False):
    appointment = AgentEvent.find_by_appointment_id(appointment_id, db)

    if dry_run:
        return {
            "success": True,
            "message": "Dry run successful"
        }

    if not appointment:
        raise ValueError("Appointment not found")

    user = AgentUser.find_by_id(user_id, db)
    if not user:
        raise ValueError("User not found")

    single_amount = Decimal(appointment.event_data['amount'])
    amount = single_amount * Decimal(appointment.event_data['count'])

    previous_balance = user.credit
    new_balance = previous_balance - amount

    # Update user's credit balance
    user.credit = new_balance
    db.commit()

    # Create refund event
    AgentEvent.create_refund_event(
        target_id=user.id,
        amount=amount,
        previous_balance=previous_balance,
        new_balance=new_balance,
        refund_event_id=appointment.id,
        description=f"Refund for appointment {appointment_id}",
        appointment_id=appointment_id,
        db=db
    )

    return {
        "success": True,
        "message": "Refund successful"
    }
