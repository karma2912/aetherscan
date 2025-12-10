import matplotlib.pyplot as plt
import numpy as np

# 1. Ensure these names match the order of your classes
class_names = [
    "OxygenTank",
    "NitrogenTank",
    "FirstAidBox",
    "FireAlarm",
    "SafetySwitchPanel",
    "EmergencyPhone",
    "FireExtinguisher",
]

# 2. UPDATE THIS LINE with your REAL scores (mAP50)
maps = np.array([0.772, 0.765, 0.746, 0.661, 0.734, 0.600, 0.807])

plt.figure(figsize=(10, 6)) # Adjusted size slightly
bars = plt.bar(class_names, maps, color=plt.cm.viridis(maps / maps.max()), width=0.6)

# Add value labels above bars
for bar, value in zip(bars, maps):
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + 0.01,
        f"{value:.2f}",
        ha="center",
        va="bottom",
        fontsize=10,
        fontweight="bold",
        color="#222",
    )

plt.title("My Model Accuracy (mAP @ 50%)", fontsize=16, pad=20) # Updated Title
plt.xlabel("Object Class", fontsize=12)
plt.ylabel("Accuracy Score (0-1)", fontsize=12)
plt.xticks(rotation=25, ha="right")
plt.ylim(0, 1.0) # Changed limit to 1.0 since scores are percentages
plt.grid(axis="y", linestyle="--", alpha=0.4)
plt.tight_layout()
plt.show()