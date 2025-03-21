import openai
from ..config import settings

# Set OpenAI API key
openai.api_key = settings.OPENAI_API_KEY

async def generate_travel_recommendations(user_preferences, destination_id=None):
    """Generate travel recommendations based on user preferences"""
    # Build prompt for GPT-4o
    prompt = f"You are an AI travel assistant for a space tourism company based in Dubai. "
    prompt += f"Generate personalized recommendations for a customer with the following preferences:\n\n"
    
    # Add user preferences to prompt
    for key, value in user_preferences.items():
        prompt += f"- {key}: {value}\n"
    
    if destination_id:
        prompt += f"\nThe customer is specifically interested in destination ID: {destination_id}."
    
    prompt += "\n\nProvide recommendations for accommodations, activities, and travel tips."
    
    # Call OpenAI API
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful space travel assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating recommendations: {str(e)}"

async def generate_packing_list(destination_id, duration, user_preferences=None):
    """Generate a packing list based on destination and trip duration"""
    # Build prompt for GPT-4o
    prompt = f"You are an AI travel assistant for a space tourism company based in Dubai. "
    prompt += f"Generate a comprehensive packing list for a {duration}-day space trip to destination ID: {destination_id}.\n\n"
    
    if user_preferences:
        prompt += "The traveler has the following preferences:\n"
        for key, value in user_preferences.items():
            prompt += f"- {key}: {value}\n"
    
    prompt += "\nThe list should include essential items, recommended clothing, special equipment for space travel, and any destination-specific items."
    
    # Call OpenAI API
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful space travel assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating packing list: {str(e)}"

async def answer_space_travel_question(question, user_context=None):
    """Answer a space travel related question using GPT-4o"""
    # Build system prompt with context
    system_prompt = "You are an AI travel assistant for a space tourism company based in Dubai. "
    system_prompt += "You specialize in space travel knowledge, safety procedures, and customer support. "
    system_prompt += "Provide accurate, helpful, and friendly responses to customer inquiries."
    
    if user_context:
        system_prompt += "\n\nUser context information:\n"
        for key, value in user_context.items():
            system_prompt += f"- {key}: {value}\n"
    
    # Call OpenAI API
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error answering question: {str(e)}"