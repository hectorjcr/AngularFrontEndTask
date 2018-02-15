import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

@Component({
	selector:'task-detail',
	templateUrl:'../views/task.detail.html',
	providers:[UserService, TaskService]
})

export class TaskDetailComponent implements OnInit{
	public identity;
	public token;
	public task: Task;
	public loading;

	constructor(
		private _userService: UserService,
		private _taskService: TaskService,
		private _route: ActivatedRoute,
		private _router: Router
		){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity && this.identity.sub){
			//Llamada al servicio de tareas para sacar una tarea
			this.getTask();
				//Llamada a metodo de este componente
		}else{
			this._router.navigate(['/login']);
		}
	}

	getTask(){
		this.loading = 'show';
		this._route.params.forEach((params: Params)=>{
			let id = +params['id'];

			this._taskService.getTask(this.token, id).subscribe(
				response =>{					
					if(response.status == 'success'){
						if(response.data.user.id == this.identity.sub){
							this.task = response.data;
							this.loading = 'hide';
							console.log(this.task);
							console.log(this.task.title);
						}else{
							this._router.navigate(['/']);
						}
						
					}else{
						this._router.navigate(['/login'])
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}

	deleteTask(id){
		this._taskService.deleteTask(this.token,id).subscribe(
			response =>{
				if(response.status == 'success'){
					this._router.navigate(['/']);
				}else{
					console.log('No se ha podido eliminar');
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}
}