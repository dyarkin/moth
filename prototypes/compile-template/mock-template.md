This is mock template

Mock number: {{ mockNumber }}
Mock number zero: {{ mockNumberZero }}
Mock string: {{ mockString }}
Mock bool: {{ mockBool }}

Conditional (number):
{% if mockNumber == 100 %}
`mockNumber` is 100
{% else %} 
`mockNumber` is not 100
{% endif %}

Conditional (number, no specific comparison):
{% if mockNumber %}
`mockNumber` is set
{% else %} 
`mockNumber` is not set
{% endif %}

Conditional (zero, comparison to 0):
{% if mockNumberZero === 0 %}
`mockNumberZero` is 0
{% else %} 
`mockNumberZero` is not 0
{% endif %}

Conditional (zero, no specific comparison):
{% if mockNumberZero %}
`mockNumberZero` is set
{% else %}
`mockNumberZero` is not set
{% endif %}

Conditional (string, double quotes):
{% if mockString == "Hello world"  %}
`mockString` is "Hello world"
{% else %}
`mockString` is not "Hello world"
{% endif %}

Conditional (string, single quotes):
{% if mockString == 'Hello world'  %}
`mockString` is "Hello world"
{% else %}
`mockString` is not "Hello world"
{% endif %}

