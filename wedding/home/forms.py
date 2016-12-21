from django.forms import DateField, Form, SelectDateWidget


class AuthenticationForm(Form):
    wedding_date = DateField(required=True, widget=SelectDateWidget(years=range(2016, 2016 + 51)))
