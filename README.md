# Treeningp-evik

###
File → Save All, seejärel:
Tools → Command Line → Developer PowerShell


# 1. Lae paketid alla
-dotnet restore

# 2. Installi EF tööriist (ainult esimest korda)
-dotnet tool install --global dotnet-ef

# 3. Ehita projekt
-dotnet build

# 4. Loo andmebaas
-dotnet ef migrations add InitialCreate

-dotnet ef database update

# 5. Käivita backend
-dotnet run
-Seejärel uues terminali aknas frontend:
-powershell 
-6. Mine frontendi kausta
-cd C:\Users\kundr\Desktop\WorkoutTracker\workout-frontend

# 7. Lae React paketid
-npm install

# 8. Käivita frontend
-npm start