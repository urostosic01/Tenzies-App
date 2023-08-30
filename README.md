# Tenzies App

Project from course Learn React (Coursera)

# Game Description

You need to collect 10 dice of the same value and keep re-rolling until you get there. You can change dice which you want to collect if more of different value appear. 

# App details
Created project using Vite. Used additional packages 'nanoid' to generate unique string ID for each die and 'react-confetti' as a decoration for completed game.
Each die gets random value from 1 to 6 and has boolean property which signalizes when die is held in hand. 
At the end we check if we have 10 dice in our hand with same value and if so, we celebrate victory with confetti.
