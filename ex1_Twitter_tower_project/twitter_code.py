from math import sqrt

# function that find odd numbers between 2 numbers
def find_odd_numbers(end):
    odd_numbers = []
    for num in range(3, end):
        if num % 2 != 0:
            odd_numbers.append(num)
    return odd_numbers

# function that print the triangle as *
def print_triangle(height, width):
    print("*".center(width))
    height -= 2
    odd_numbers = find_odd_numbers(width)
    num_of_rows_for_each_odd_number = height // len(odd_numbers)
    num_of_rows_to_three = height - num_of_rows_for_each_odd_number*(len(odd_numbers)-1)
    for i in range(len(odd_numbers)):
        row_width = odd_numbers[i]
        rows = num_of_rows_for_each_odd_number
        if i == 0:
            rows = num_of_rows_to_three
        for j in range(rows):
            print(("*" * row_width).center(width))

    print("*" * width)

# function that handle the rectangular tower
def rectangular_tower(height, width):
    if abs(height - width) > 5:
        area = height * width
        print("The tower area is", area)
    else:
        perimeter = 2 * (height + width)
        print("The tower perimeter is", perimeter)

#function that handle the triangle tower
def triangle_tower(height, width):
    print("Menu:")
    print("1. Calculate perimeter")
    print("2. Print triangle")
    choice = input("Enter your choice: ")

    if choice == "1":
        calf = sqrt((width / 2) ^ 2 + height ^ 2)
        perimeter = 2 * calf + width
        print("The perimeter of the triangle is", perimeter)
    elif choice == "2":
        if width % 2 == 0 or width > 2 * height:
            print("The triangle cannot be printed.\n")
        else:
            print_triangle(height,width)
    else:
        print("Invalid choice. Please try again.\n")

# function that handle the menu in the program
def menu():
    while True:
        print("Menu:")
        print("1. Rectangular tower")
        print("2. Triangle tower")
        print("3. Exit")
        option = input("Enter your choice: ")
        height = int(input("Enter height:"))
        width = int(input("Enter width:"))
        if option == "1":
            rectangular_tower(height,width)
        elif option == "2":
            triangle_tower(height,width)
        elif option == "3":
            break
        else:
            print("Invalid choice. Please try again.")

# main
if __name__ == '__main__':
    menu()
