import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../recipe.service';
import { Recipe } from '../../../../entities/recipe.model';
import { Category } from '../../../../entities/Category.model';
import { CategoryService } from '../../../category.service';


@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.css']
})
export class AllRecipesComponent implements OnInit {
  recipeList: Recipe[] = [];
  categoryList: Category[] = [];
  filteredRecipes: Recipe[] = this.recipeList;
  selectedCategories: number[] = [];
  categorySelection: { [key: number]: boolean } = {}; // מפתח: שם הקטגוריה, ערך: האם הקטגוריה נבחרה או לא
  preparationTime: number = 0;
  difficultyLevel: number = 1;
  filterByName:string=''
  constructor(private recipeService: RecipeService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.recipeService.getRecipeList().subscribe({
      next: (res) => {
        this.recipeList = res;
        this.filteredRecipes = [...this.recipeList];
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.categoryService.getCategoryList().subscribe({
      next: (res) => {
        this.categoryList = res;
        this.selectedCategories != this.categoryList.find(c => c.name)
      },
      error: (err) => {
        console.log(err);
      }
    });

  }
  applyFilters() {
    this.filteredRecipes = this.filteredRecipes.filter(recipe => {
      const timeCondition = this.preparationTime === 0 || recipe!.preparationTime! <= this.preparationTime;
      const difficultyCondition = this.difficultyLevel === 1 || recipe!.difficultyLevel! <= this.difficultyLevel;
      return timeCondition && difficultyCondition;
    });
  }
  filterByCategory(categoryId: number) {
    this.selectedCategories = this.selectedCategories.includes(categoryId)
      ? this.selectedCategories.filter(id => id !== categoryId)
      : [...this.selectedCategories, categoryId];
    
    this.filteredRecipes = 
       this.recipeList.filter(recipe => this.selectedCategories.includes(recipe.categoryId));
  }

  filterAll() {
    this.filteredRecipes = this.recipeList.filter(recipe => {
      const timeCondition = this.preparationTime === 0 || recipe.preparationTime <= this.preparationTime;
      const difficultyCondition = this.difficultyLevel === 1 || recipe.difficultyLevel <= this.difficultyLevel;
      const nameCondition = this.filterByName === '' || recipe.name.toLowerCase().includes(this.filterByName.toLowerCase());
      const categoryCondition = this.selectedCategories.length === 0 || this.selectedCategories.includes(recipe.categoryId);
      
      return timeCondition && difficultyCondition && nameCondition && categoryCondition;
    });
  }
    resetFilters() {
      this.preparationTime = 0;
      this.difficultyLevel = 1;
      this.filteredRecipes = [...this.recipeList]; // או להשים רשימה ריקה במקרה שבו אתה רוצה להציג את כל המתכונים מחדש
    }
  }
